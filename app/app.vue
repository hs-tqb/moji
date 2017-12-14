<template>
  <div id="app" :class="hasRecordLink ? '' : 'no-bg'">
    <header v-if="hasRecordLink">
      <h1>坏天气[保险]</h1>
      <p>只要下大雨，就有红包拿</p>
    </header>
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
    <a href="http://m.baotianqi.cn/deal/show_pay" id="float-link" v-if="hasRecordLink">我的保障记录</a>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        hasRecordLink: true,
        transitionName: ''
      };
    },
    watch: {
      '$route' (to, from) {
        this.hasRecordLink = ['homepage', 'welcome'].indexOf(to.name) !== -1;
        if (to.name === 'faq') {
          this.transitionName = 'fade-in-up';
          return;
        }
        if (from.name === 'faq') {
          this.transitionName = 'fade-out-down';
          return;
        }

        let order = ['homepage', 'checkout', 'receipt'];
        to = order.indexOf(to.name);
        from = order.indexOf(from.name);
        this.transitionName = to < from ? 'slide-right' : 'slide-left';
      }
    }
  }
</script>