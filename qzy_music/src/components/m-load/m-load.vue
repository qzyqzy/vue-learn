<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" />
    <p class="desc">{{ title }}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '来杯卡布奇诺吧...'
    }
  }
};
</script>

<style scoped lang="scss">
@import 'scss/variable';

.loading {
  width: 100%;
  text-align: center;
  .desc {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
  }
}
</style>
