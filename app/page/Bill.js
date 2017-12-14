/**
 * Created by meathill on 2017/5/16.
 */
import Vuex from 'vuex';

export default {
  computed: {
    ...Vuex.mapState([
      'start',
      'end',
      'city_id',
      'mobile',
      'coupon',
      'couponCode',
      'dealCode',
      'total_days',
      'productId',
      'productList',
      'username',
      'user_id',
      'payMethod'
    ]),
    ...Vuex.mapGetters([
      'city',
      'total',
      'product'
    ])
  },
  filters: {
    date: value => {
      return value.substr(0, 4) + '年' + value.substr(4, 2) + '月' + value.substr(6, 2) + '日';
    }
  }
};