<template>
  <div class="modal">
    <div class="backdrop" @click="onClickBackdrop" v-if="active"></div>
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <alert @ok="onOK" v-if="current === 'alert'" :msg="msg"></alert>
      <paying @ok="onOK" v-if="current === 'paying'" :msg="msg" :timeout="timeout"></paying>
      <div class="modal-body" v-if="current === 'error'">
        <p>{{msg}}</p>
        <p class="text-center"><i class="icon-spinner animate-spin"></i></p>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import Alert from './alert.vue';
import Paying from './paying.vue';
import {isString} from '../../utils';

export default {
  components: {
    Alert,
    Paying
  },
  data() {
    return {
      active: false,
      current: null,
      backdrop: true,
      msg: '',
      timeout: 2
    };
  },
  methods: {
    alert(msg) {
      this.popup('alert', msg);
    },
    close() {
      this.current = null;
      this.active = false;
      this.msg = '';
      this.$emit('close');
    },
    popup(popup, msg) {
      if (isString(msg)) {
        this.msg = msg;
      } else {
        this.backdrop = 'backdrop' in msg ? msg.backdrop : true;
      }
      this.current = popup;
      this.active = true;
    },
    wait(msg) {
      this.timeout = 0;
      this.popup('paying', msg);
    },
    onOK() {
      this.close();
    },
    onClickBackdrop() {
      if (!this.backdrop) {
        return;
      }
      this.close();
    }
  }
};
</script>