<template>
  <div id="welcome">
    <header>
      <p v-if="records" class="animated fadeInUp" @animationend="onAnimationEnd">{{message.mobile}}领取<br>{{message.compensateRule}}元{{message.city}}{{message.caption}}红包</p>
    </header>
    <div class="body">
      <ul>
        <li>
          下大雨就有红包20元
          <small>微信自动发红包，真金白银</small>
        </li>
        <li>
          0.8元起购，多买多赔
          <small>支持全国120+城市和热门景区</small>
        </li>
        <li>
          自选时间，最快明天起保
          <small>最长保障一个月，安心等待红包</small>
        </li>
        <li>
          气象局权威数据自动判定
          <small>最快次日出结果，数据公开可查</small>
        </li>
      </ul>
      <a href="#/" class="btn btn-block">立即购买</a>
    </div>
    <footer>
      Powered by  天气宝（微信搜索：天气宝）
    </footer>
  </div>
</template>

<script>
import Alfred from '../alfred';
import record from '../../data/1.json';

export default {
  name: 'welcome',
  computed: {
    message() {
      return this.records[this.current];
    }
  },
  data() {
    return {
      records: null,
      current: 0
    };
  },
  methods: {
    onAnimationEnd(event) {
      if (event.animationName === 'fadeInUp') {
        event.target.classList.remove('fadeInUp');
        setTimeout(() => {
          event.target.classList.add('fadeOutDown');
        }, 2000);
      } else if (event.animationName === 'fadeOutDown') {
        if (this.current < this.records.length - 1) {
          this.current += 1;
        } else {
          this.current += 0;
        }
        event.target.classList.remove('fadeOutDown');
        event.target.classList.add('fadeInUp');
      }
    }
  },
  mounted() {
    this.records = record.map(item => {
      return {
        mobile: item[0],
        compensateRule: item[2],
        city: item[1],
        caption: item[3],
      };
    });
  }
}
</script>