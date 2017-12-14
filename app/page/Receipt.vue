<template>
  <div id="receipt" class="bill">
    <header>
      <template v-if="paySuccess">
        <h3 class="success"><i class="icon-ok-circled2"></i> 购买成功</h3>
        <p class="lead">手机号码：{{mobile}}</p>
        <p>
          <span class="red">重要！请一定关注天气宝微信号（tianqibao2015)，</span>才能领取
          天气补贴红包，红包将在保障期结束后，通过微信自动转给联系人
        </p>
        <div class="btn-group">
          <a href="#/" class="btn btn-primary" @click="restart">再次购买</a>
          <a href="#/" class="btn btn-primary share-button" @click.prevent="share">分享</a>
        </div>
      </template>
      <template v-else>
        <h3 class="error"><i class="icon-cancel-circled-outline"></i> 购买失败</h3>
        <p class="lead">用户取消购买或支付失败</p>
        <p>
          <a href="#/" class="btn btn-primary btn-block" @click="restart">再次购买</a>
        </p>
      </template>
    </header>
    <div class="bar"></div>
    <dl>
      <dt>保障城市</dt>
      <dd>{{city}}</dd>
      <dt>保障开始时间</dt>
      <dd>{{start | date}}00:00</dd>
      <dt>保障结束时间</dt>
      <dd>{{end | date}}23:59</dd>
      <dt>订单金额</dt>
      <dd>{{total}}元</dd>
      <dt>保障金额</dt>
      <dd>每日赔付{{product.compensateRule}}元，共计{{total_days * product.compensateRule}}元</dd>
      <dt>补贴条件</dt>
      <dd>任意单日{{product.label}}>{{product.threshold}}mm</dd>
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{mobile}}</a></dd>
      <dt>站点信息</dt>
      <dd>以{{city}}气象站（编号{{city_id}}）为准</dd>
    </dl>
  </div>
</template>

<script>
import moji from '../moji';
import bill from './Bill';
import ActionTypes from '../store/action-types';
import MutationTypes from '../store/mutation-types';

export default {
  mixins: [bill],
  computed: Vuex.mapState([
    'paySuccess'
  ]),
  created() {
    zhuge.track('result', {
      success: this.paySuccess
    });
  },
  template: '#receipt-template',
  methods: {
    // TODO 分享链接，图片
    share() {
      moji.share({
        title: '晴空天气宝，不怕坏天气',
        description: '担心坏天气？快来领天气现金补贴！天很热、下大雨统统都赔！',
        link: 'http://m.baotianqi.cn'
      })
        .then(message => {
          if (message.code !== 1) {
            throw new Error('分享时发生错误：' + message.msg);
          }
          this.$store.dispatch(ActionTypes.FETCH_DEAL);
          this.$router.push('/');
        })
        .catch(err => {
          if (err instanceof Error) {
            err = err.message;
          }
          alert('分享时发生错误：' + err);
        });
    },
    restart() {
      this.$store.dispatch(ActionTypes.FETCH_DEAL);
      this.$store.commit(MutationTypes.RESET);
    }
  }
};
</script>