<template>
<div class="modal-body alert">
  <div class="icon"></div>
  <p>{{msg}}</p>
  <button type="button" class="btn btn-secondary confirm-button" @click="confirm">确定</button>
</div>
</template>

<script>
export default {
  name: 'alert',
  props: ['msg'],
  methods: {
    confirm() {
      this.$emit('ok');
    }
  }
}
</script>