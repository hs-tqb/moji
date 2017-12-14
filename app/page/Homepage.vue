<template>
  <div id="homepage">
    <form id="buy" @submit.prevent="checkout">
      <div class="form-group">
        <input name="city" type="hidden" id="city" class="tqb-city-picker-input" @change="onCityChange">
        <label for="city" :data-url="api + 'getCitys'" data-hot="9" class="tqb-city-picker-label" onclick="">{{city}}</label>
      </div>
      <h4><i class="calendar"></i> 选择保障起止日期</h4>
      <div class="form-group dates">
        <input name="date" type="hidden" id="date" :data-start="tomorrow" :data-end="thisEve" data-range="30" data-label-filter-start="{m}月{d}日" data-label-filter-end="{m}月{d}日" @change="onDateChange" data-format="yyyymmdd" :value="start + '~' + end">
        <label for="date" class="tqb-date-picker-label start" onclick="" v-html="$options.filters.formatDateLabel(start)"></label>
        <div class="to">
          <i class="icon-right-open to"></i>
        </div>
        <label for="date" class="tqb-date-picker-label end" onclick="" v-html="$options.filters.formatDateLabel(end)"></label>
        <p class="amount"><small class="text-muted">共{{total_days}}天</small></p>
      </div>
      <div class="header-help">
        <h4><i class="envelop"></i> 选择天气补贴</h4>
        <a href="#/faq" class="help">?</a>
      </div>
      <div class="form-group hongbao-list">
        <template v-for="(product, index) in productList">
          <input type="radio" name="product" :value="product.productId" :id="'product-' + product.productId" @change="onSelectProduct" :checked="productId === product.productId" :data-productId="productId">
          <label :for="'product-' + product.productId">
            <h3>{{product.caption}}红包</h3>
            <span class="price" v-text="product.compensateRule * total_days"></span>
            <p>
              保障期内任意单日{{product.label}}>{{product.threshold}}mm，就发红包 <strong>￥{{product.compensateRule}}/天</strong><br>
              所有红包累计金额不超过 <strong v-text="'￥' + product.compensateRule * total_days">￥</strong>
            </p>
            <i class="icon-ok"></i>
          </label>
        </template>
        <p class="help-block text-muted">
          最终天气实测值以中国气象局{{city}}气象站（编号{{city_id}}）为准。保障开始时间为当日0:00，结束时间为23:59
        </p>
      </div>
      <h4 class="buy-info"><i class="cart"></i> 购买信息</h4>
      <div class="form-group">
        <input type="tel" name="mobile" class="form-control" placeholder="您的手机号码，必填~" required id="mobile" pattern="^1[34578]\d{9}$" @change="onMobileChange" :value="mobile" maxlength="11">
        <label class="required" for="mobile"></label>
      </div>
    </form>
    <div class="how-to-play">
      <img src="img/intro.jpg">
    </div>
    <footer class="cart">
      <div class="total">
        <template v-if="isFetching">
          <span class="text-muted">计算中...</span>
        </template>
        <template v-else>
          需支付：<span class="price">{{total}}元</span>
        </template>
      </div>
      <button form="buy" class="btn btn-primary" :disabled="isFetching || isSubmitting">
        <i v-if="isSubmitting" class="spinner"></i> 立即支付
      </button>
    </footer>
  </div>
</template>

<script>
import Vuex from 'vuex';
import {find} from '../polyfill/find';
import Alfred from '../alfred';
import PopupManager from '../component/popup/manager';
import ActionTypes from '../store/action-types';
import MutationTypes from '../store/mutation-types';
import { formatDate, toDate } from '../utils';

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default {
  template: '#homepage-template',
  name: 'homepage',
  data: () => {
    return {
      isChecking: false,
      isSubmitting: false,
      product: null
    }
  },
  computed: {
    isCouponChecked() {
      return this.coupon !== null;
    },
    tomorrow() {
      let date = new Date();
      date.setDate(date.getDate() + 1);
      return formatDate(date);
    },
    thisEve() {
      let date = new Date();
      date.setMonth(11);
      date.setDate(27);
      return formatDate(date);
    },
    ...Vuex.mapState([
      'api',
      'mobile',
      'city_id',
      'coupon',
      'couponCode',
      'dealCode',
      'productList',
      'productId',
      'headerIMG',
      'start',
      'end',
      'total_days',
      'isFetching'
    ]),
    ...Vuex.mapGetters([
      'city',
      'total'
    ])
  },
  filters: {
    formatDateLabel(date) {
      let md = date.substr(4, 2) + '月' + date.substr(6, 2) + '日';
      date = toDate(date);
      let today = new Date();
      let description = '';
      if (date.getTime() - today.getTime() < 86400000) {
        description = '明天';
      } else if (date.getTime() - today.getTime() < 86400000 * 2) {
        description = '后天';
      } else {
        description = WEEK[date.getDay()];
      }
      return `${md} <small>${description}</small>`;
    }
  },
  methods: {
    checkout() {
      if (!this.productId) {
        PopupManager.alert('您还没有选择补贴红包');
        return;
      }
      if (!this.mobile) {
        PopupManager.alert('请正确填写手机号码');
        return;
      }
      if (!this.dealCode) {
        PopupManager.wait('订单号错误，正在帮您重新申请');
        this.$store.dispatch(ActionTypes.FETCH_DEAL)
          .then(() => {
            PopupManager.msg = '之前的订单号错误，已帮您重新申请。<br>请检查后重新提交订单。';
            PopupManager.timeout = 2;
          });
        return;
      }
      Alfred.checkDeal(this.dealCode)
        .then( response => {
          if (response.state === '1') {
            this.$router.push('checkout');
          } else {
            PopupManager.wait('您的订单已过期，正在帮您重新申请');
            this.$store.dispatch(ActionTypes.FETCH_DEAL)
              .then(() => {
                PopupManager.msg = '之前的订单已过期，已帮您重新申请。<br>请检查后重新提交订单。';
                PopupManager.timeout = 2;
              });
          }
        });

      zhuge.track('checkout', {
        total: this.total
      });
    },
    onCityChange(event) {
      let cityName = this.$el.querySelector(`[for=${event.target.id}]`).textContent;
      this.$store.commit(MutationTypes.SET_CITY, {
        id: event.target.value,
        cityName: cityName
      });
      this.$store.dispatch(ActionTypes.FETCH_DEAL);

      zhuge.track('city', {
        id: event.target.value
      });
    },
    onCouponChange(event) {
      const target = event.target;
      let code = target.value;
      if (code === '') {
        this.isCouponChecked = false;
        return;
      }
      if (!this.mobile) {
        return;
      }
      this.isChecking = true;
      Alfred.checkCoupon(code, this.mobile)
      /**
       * @param {Object} json
       *    @param {Number} json.price
       */
        .then( json => {
          this.isChecking = false;
          this.$store.commit(MutationTypes.SET_COUPON, {
            coupon: json.price,
            couponCode: code
          });
        });

      zhuge.track('coupon');
    },
    onDateChange(event) {
      let range = event.target.value.split(/\s*~\s*/);
      this.$store.commit(MutationTypes.SET_RANGE, {
        start: range[0],
        end: range[1]
      });
      this.$store.dispatch(ActionTypes.FETCH_DEAL);

      zhuge.track('date', {
        start: range[0],
        end: range[1]
      });
    },
    onMobileChange(event) {
      let value = event.target.value.trim();
      if (!/^1[34578]\d{9}$/.test(event.target.value)) {
        PopupManager.alert('请填写正确的手机号码');
        return;
      }
      this.$store.commit(MutationTypes.SET_MOBILE, value);

      if ('zhuge' in window) {
        zhuge.identify(value);
      }
    },
    onSelectProduct(event) {
      let product = find(this.productList, product => {
        return product.productId === event.target.value;
      });
      this.$store.commit(MutationTypes.SET_PRICE, {
        productId: event.target.value,
        compensateRule: product.compensateRule
      });

      zhuge.track('select', {
        id: product.productId,
        price: product.price,
        compensateRule: product.compensateRule
      });
    }
  }
};
</script>