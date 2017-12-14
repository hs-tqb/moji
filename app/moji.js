/**
 * Created by realm on 2017/5/12.
 */
import {find} from './polyfill/find';

const BEIJING = 'CN54511';
let mjJs;

/* global DEBUG, APP_ID, mojiJs */
if (DEBUG) {
  mjJs = require('./mock/mojiSDK');
} else {
  mjJs = mojiJs();
}

export default {
  getUserId() {
    return new Promise(resolve => {
      mjJs.appUserId({
        callback: message => {
          resolve(message.data);
        }
      });
    });
  },
  getUserInfo() {
    return new Promise(resolve => {
      mjJs.getUsrPic({
        callback: message => {
          resolve(message.data);
        }
      });
    });
  },
  /**
   * 取用户当前身处的城市，出任何意外都返回北京
   * @return Object|Promise {{city: string, city_id: string}}
   */
  location() {
    return new Promise(resolve => {
      mjJs.getCityList({
        callback: message => {
          resolve(message);
        }
      });
    })
      .then(message => {
        if (message.code === 0 || !message.data || message.data.length === 0) {
          throw new Error('no position');
        }
        /**
         * @param {Object} city
         * @param {Number} city.is_location
         */
        let city = find(message.data, city => {
          return Number(city.is_localtion) === 1 || Number(city.is_location) === 1;
        });
        if (city) {
          return city.city_id;
        } else {
          return BEIJING;
        }
      })
      .catch( () => {
        return BEIJING;
      });
  },
  locationH5() {
    if (!('geolocation' in navigator)) {
      return BEIJING;
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition( position => {
        resolve(position.coords);
      }, (err) => {
        reject(err);
      }, {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 30000
      });
    })
      .then(coords => {
        return new Promise(resolve => {
          mjJs.locationH5({
            data: {
              lat: coords.latitude,
              lon: coords.longitude
            },
            callback: message => {
              resolve(message.data.city_id);
            }
          });
        });
      })
      .catch( err => {
        console.log(err.code + ':' + err.message);
        return BEIJING;
      });
  },
  pay({type, total, order, mobile, user_id, username}) {
    type = type === null ? 1 : type;
    username = username || mobile;
    return new Promise(resolve => {
      mjJs.appPay({
        data: {
          type: type,
          appid: APP_ID,
          pname: '晴空万里宝',
          price: total,
          order: order,
          userid: user_id,
          username: username
        },
        callback: message => {
          resolve(message);
        }
      });
    });
  },
  share({title, description, link}) {
    return new Promise(resolve => {
      mjJs.shareDo({
        data: {
          app_title: title,
          app_desc: description,
          app_link: link,
          app_img_url: '',
          app_big_img_url: ''
        },
        callback: message => {
          resolve(message);
        }
      });
    });

  },
  start() {
    return new Promise((resolve, reject) => {
      mjJs.config({
        appId: APP_ID
      });
      mjJs.ready(function () {
        resolve();
      });
      mjJs.error(function (res) {
        reject(res);
      });
    });
  }
};