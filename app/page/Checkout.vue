<template>
  <div id="checkout" class="bill">
    <dl class="detail">
      <dt>保障城市</dt>
      <dd>{{city}}</dd>
      <dt>保障开始时间</dt>
      <dd>{{start | date}}00:00</dd>
      <dt>保障结束时间</dt>
      <dd>{{end | date}}23:59</dd>
      <dt>补贴条件</dt>
      <dd>
        <p>任意单日{{product.label}}>{{product.threshold}}mm</p>
        <p><small>最终天气数据以{{city}}气象站（编号{{city_id}}）为准</small></p>
      </dd>
      <dt>最大补贴红包</dt>
      <dd>{{product.compensateRule * total_days}}元</dd>
    </dl>
    <dl class="count">
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{mobile}}</a></dd>
      <dt>保障售价</dt>
      <dd class="price">{{product.price / 100}}元</dd>
      <dt>优惠码</dt>
      <dd class="discount">-{{coupon / 100}}元</dd>
      <dd class="final">实付：<span class="price">{{total}}元</span></dd>
    </dl>
    <footer>
      <h3>请选择支付方式</h3>
      <button @click="onSubmit" :disabled="isSubmitting" class="btn btn-block weixin">微信</button>
      <button @click="onSubmit" :disabled="isSubmitting" class="btn btn-block alipay">支付宝</button>
    </footer>
  </div>
</template>

<script>
import moji from '../moji';
import Alfred from '../alfred';
import MutationTypes from '../store/mutation-types';
import ActionTypes from '../store/action-types';
import PopupManager from '../component/popup/manager';
import bill from './Bill';
import { onVisibilityChange } from '../utils';

export default {
  mixins: [bill],
  template: '#checkout-template',
  data() {
    return {
      isSubmitting: false
    };
  },
  methods: {
    onSubmit(event) {
      if (this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;
      if (event.target.classList.contains('weixin')) {
        zhuge.track('set_pay', {
          type: 'weixin'
        });
        this.$store.commit(MutationTypes.SET_PAY, 0);
      } else {
        zhuge.track('set_pay', {
          type: 'alipay'
        });
        this.$store.commit(MutationTypes.SET_PAY, 1);
      }
      Alfred.checkDealAgain(this.dealCode)
        .then(response => {
          if (response.state !== '1') {
            PopupManager.alert(response.msg);
            this.$store.dispatch(ActionTypes.FETCH_DEAL);
            throw new Error('订单已过期');
          }

          PopupManager.popup('paying', {
            backdrop: false
          });
          PopupManager.$once('close', () => {
            zhuge.track('cancel-pay');
            this.isSubmitting = false;
          });
          return Alfred.addDeal({
            dealCode: this.dealCode,
            productId: this.productId,
            mobile: this.mobile,
            couponCode: this.couponCode,
            total: this.total
          });
        })
        .then( response => {
          if (response.state !== '1') {
            PopupManager.alert(response.msg);
            throw new Error('创建订单失败');
          }

          return moji.pay({
            type: this.payMethod,
            total: this.total,
            order: this.dealCode,
            mobile: this.mobile,
            username: this.username,
            user_id: this.user_id
          });
        })
        .then( message => {
          if (message.code) {
            return message.order_id_moji
          }
          throw new Error('付款失败');
        })
        .then( moji_id => {
          PopupManager.close();
          this.$store.commit(MutationTypes.SET_SUCCESS, !!moji_id);
          this.$router.push('receipt');
        })
        .catch( err => {
          if (err instanceof Error) {
            err = err.name + ': ' + err.message;
          }
          console.log(err);
          this.$store.commit(MutationTypes.RESET, false);
          this.$router.push('receipt');
        });

      zhuge.track('pay', {
        total: this.total
      });
    }
  }
}
</script>