<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">炸鸡音乐</h1>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'VHeader'
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';

.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    margin-right: 9px;
    width: 30px;
    height: 32px;
    @include bg-image('logo');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
}
</style>
