<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'Loading',
    props: {
      title: {
        type: String,
        default: '正在加载...'
      }
    }
  };
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
  @import "@scss/variable.scss";
  .loading {
    width: 100%;
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-medium;
      color: $color-text-l;
    }
  }
</style>
