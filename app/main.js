/**
 * Created by meathill on 2017/5/11.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import $ from 'jquery';
import App from './app.vue';
import moji from './moji';
import Alfred from './alfred';
import routes from './router';
import base from './store/index';
import MutationTypes from './store/mutation-types';
import PopupManager from './component/popup/manager';
import {formatDate, needFastClick, loadScripts} from './utils';

/* global DEBUG, API, zhuge, _load_start, VueRouter */
if (DEBUG) {
  Vue.config.devtools = true;
}

base.state.api = API;

// 如果 1分钟后还没有完成初始化，就记录一次错误
setTimeout(() => {
  if ($('#loading').length) {
    zhuge.track('init-error');
  }
}, 60000);

// 判断是不是在墨迹应用内部，不然的话跳走
let start = DEBUG || /moji/i.test(navigator.userAgent) ? Promise.resolve()
  : Promise.reject('本购买页仅供墨迹天气内嵌使用，正在帮您跳转到常规购买页。');

// 初始化墨迹连接
start
  .catch(err => {
    PopupManager.popup('error', err);
    if (!DEBUG) {
      location.href = 'http://m.baotianqi.cn?merchantid=30054';
    }
    throw new Error('Go to normal page');
  })
  .then(() => {
    return Promise.all([
      loadScripts(), // 加载其它脚本
      moji.start() // 加载数据
        .then(moji.getUserId) // 取用户基本信息，判断是否已登录
        .then( response => {
          if (response.sns_id) {
            base.state.user_id = response.sns_id;
            return moji.getUserInfo();
          }
          base.state.user_id = response.user_id;
          return null;
        })
        .then( user => {
          if (user) {
            base.state.username = user.nick;
            base.state.mobile = user.mobile;
          }
          return moji.location();
        })
        .then( city_id => {
          base.state.city_id = city_id;
          let date = new Date();
          date.setDate(date.getDate() + 1);
          base.state.start = formatDate(date);
          base.state.end = formatDate(date);
          return Alfred.initData(city_id);
        })
    ]);
  })
  .then( ([, data]) => {
    base.state.city_id = data.defaultCityId;
    base.state.cityList = {};
    base.state.cityList[data.defaultCityId] = {
      cnName: data.defaultCityName
    };
    return data;
  })
  .then( data => {
    let store = new Vuex.Store(base);
    let router = new VueRouter({
      base: location.pathname.substr(0, location.pathname.lastIndexOf('/') + 1),
      routes
    });
    store.commit(MutationTypes.RESET_PRODUCT_LIST, data);
    $('#loading').remove();
    new Vue({
      store,
      router,
      ...App
    }).$mount('#app');

    if (base.state.mobile) {
      zhuge.identify(base.state.mobile);
    }
    zhuge.track('ready', {
      duration: Date.now() - _load_start,
      from: 'a'
    });
  })
  .catch( err => {
    console.log(err);
  });

// 好像还是有 300ms 的问题
if (needFastClick()) {
  let script = document.createElement('script');
  script.src = '//cdn.staticfile.org/fastclick/1.0.6/fastclick.min.js';
  script.async = true;
  script.onload = function () {
    /* global FastClick */
    FastClick.attach(document.body);
  };
  document.body.appendChild(script);
}