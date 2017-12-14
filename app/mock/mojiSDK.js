/**
 * Created by meathill on 2017/5/15.
 */

module.exports = {
  config(obj) {
    this.appId = obj.appId;
  },
  ready(callback) {
    callback();
  },
  error(callback) {
    callback();
  },
  appPay(obj) {
    obj.callback({
      code: 1,
      order_id: obj.order,
      pay_type: 1,
      order_id_moji: '1234556'
    });
  },
  appUserId(obj) {
    obj.callback({
      data: {
        sns_id: 'meathill'
      }
    });
  },
  getCityList(obj) {
    obj.callback({
      code: 1,
      data: [
        {
          is_localtion: 1,
          city_id: 5521
        }
      ]
    });
  },
  getUsrPic(obj) {
    obj.callback({
      data: {
        mobile: '18901233280',
        nick: 'meathill'
      }
    });
  },
  location(obj) {
    return this.locationH5(obj);
  },
  locationH5(obj) {
    obj.callback({
      code: 1,
      msg: 'ok',
      data: {
        city_id: '5521'
      }
    });
  }
};