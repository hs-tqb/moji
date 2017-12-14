/**
 * Created by meathill on 2017/5/14.
 */

import mutations from './mutations';
import actions from './actions';

export default {
  state: {
    coupon: null,
    couponCode: '',
    dealCode: null,
    mobile: null,
    start: '',
    end: '',
    productId: null,
    productList: null,
    compensateRule: 0,
    total_days: 1,
    paySuccess: true,
    isFetching: false,
    payMethod: 1
  },
  actions,
  mutations,
  getters: {
    city: state => {
      const city = state.cityList[state.city_id];
      return city ? city.cnName : '无此城市';
    },
    product: state => {
      let id = state.productId;
      if (!id) {
        return state.productList[0];
      }
      return state.productList.find( product => {
        return product.productId === id;
      });
    },
    total: state =>  {
      let product = state.productList.find( product => {
        return product.productId === state.productId;
      });
      let total = (product ? product.price : 0) - state.coupon;
      return total > 0 ? total / 100 : 0;
    }
  }
};