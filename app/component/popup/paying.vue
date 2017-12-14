<template>
<div class="modal-body paying">
  <p v-html="message"></p>
  <button type="button" class="btn btn-secondary confirm-button" @click="confirm" v-if="ready">确定</button>
  <p class="text-center" v-else><i class="icon-spinner animate-spin"></i></p>
</div>
</template>

<script>
  export default {
    name: 'paying',
    props: {
      msg: '',
      timeout: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        ready: false
      }
    },
    computed: {
      message() {
        return this.msg || (this.ready ? '请完成支付。' : '正在为您打开支付窗口，请稍候片刻');
      }
    },
    created() {
      if (this.timeout) {
        setTimeout(() => {
          this.ready = true;
        }, this.timeout * 1000);
      }
    },
    methods: {
      confirm() {
        this.$emit('ok');
        this.ready = false;
      }
    },
    watch: {
      timeout() {
        this.ready = true;
      }
    }
  }
</script>