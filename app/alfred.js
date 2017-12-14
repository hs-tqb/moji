/* global API, MERCHANT_ID */
import $ from 'jquery';

/* global DEBUG */

export default {
  initData(city) {
    return $.ajax(API + 'initData', {
      data: {
        merchantId: MERCHANT_ID,
        cityId: city
      },
      dataType: 'json'
    });
  },
  checkCoupon(code, mobile) {
    return $.ajax(API + 'verifyCoupons', {
      data: {
        couponsCode: code,
        mobile: mobile,
        merchantId: MERCHANT_ID
      },
      dataType: 'json'
    });
  },
  checkDeal(dealCode) {
    return $.ajax(API + 'beforFirstStep', {
      data: {
        dealCode: dealCode
      },
      dataType: 'json'
    });
  },
  checkDealAgain(dealCode) {
    return $.ajax(API + 'beforSecondSteps', {
      data: {
        dealCode: dealCode
      },
      dataType: 'json'
    });
  },
  addDeal({dealCode, moji_id, productId, mobile, couponCode, total}) {
    return $.ajax(API + 'addDeal', {
      data: {
        dealCode: dealCode,
        orderIdMoji: moji_id,
        productId: productId,
        mobile: mobile,
        coupons: couponCode,
        payFee: total
      },
      dataType: 'json'
    });
  },
  getContract(city_id, start, end) {
    return $.ajax(API + 'getContract', {
      data: {
        cityId: city_id,
        startTime: start,
        endTime: end,
        merchantId: MERCHANT_ID
      },
      dataType: 'json'
    });
  },
  fetchRecords() {
    if (DEBUG) {
      return Promise.resolve([
        {
          'mobile': '189xxxx3280',
          compensateRule: 20,
          city: '广州',
          caption: '大雨'
        }
      ]);
    }
    return $.ajax(API + 'records', {
      dataType: 'json'
    });
  }
};