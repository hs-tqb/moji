/**
 * Created by meathill on 2017/5/14.
 */

import MutationTypes from './mutation-types';
import { toDate, getThresholdCaption } from '../utils';

export default {
  [MutationTypes.SET_CITY] (state, {id, cityName}) {
    state.city_id = id;
    state.cityList[id] = {
      cnName: cityName
    };
  },
  [MutationTypes.SET_COUPON] (state, {coupon, couponCode}) {
    state.coupon = coupon * 100;
    state.couponCode = couponCode;
  },
  [MutationTypes.SET_MOBILE] (state, value) {
    state.mobile = value;
  },
  [MutationTypes.SET_PAY] (state, value) {
    state.payMethod = value;
  },
  [MutationTypes.SET_PRICE] (state, {productId, compensateRule}) {
    state.productId = productId;
    state.compensateRule = compensateRule;
  },
  [MutationTypes.SET_RANGE] (state, {start, end}) {
    state.start = start;
    state.end = end;
    start = toDate(start);
    end = toDate(end, 1);
    state.total_days = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
  },

  [MutationTypes.RESET_PRODUCT_LIST] (state, json) {
    let products = json.products.reduce( (memo, product) => {
      memo[product.productId] = product;
      return memo;
    }, {});
    let source = 'productList' in json ? json.productList : state.productList;
    let productList = source.map( product => {
      const productId = product.productId;
      if (product.productName.indexOf('雨')) {
        product.label = '累计降水量';
      }
      product.threshold = products[productId].threshold;
      product.caption = getThresholdCaption(products[productId].threshold);
      product.price = Math.round(products[productId].price * 100);
      if (state.productId === productId) {
        state.price = product.price;
      }
      return product;
    });
    if (productList.length === 1) {
      state.productId = productList[0].productId;
    }
    Vue.set(state, 'productList', productList);
    state.dealCode = json.dealCode;
    state.isFetching = false;
  },

  [MutationTypes.SET_SUCCESS] (state, pay) {
    state.paySuccess = pay;
  },

  [MutationTypes.RESET] (state) {
    state.price = 0;
    state.dealCode = state.moji_id = state.coupon = state.couponCode = state.productId = null;
  },
}