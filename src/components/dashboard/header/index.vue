<template>
  <div class="header">
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/talk">社区</router-link>
      </div>
    </div>

  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'VHeader',
  props: {},
  data() {
    return {};
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
.header {
  .tab {
    display: flex;
    text-align: center;
    height: 40px;
    background-color: black;
    .tab-item {
      flex: 1;
      a {
        color: #fff;
        display: block;
        text-decoration: none;
        line-height: 40px;
        &.router-link-active {
          color: gold;
          background-color: floralwhite;
        }
      }
    }
  }
}
</style>
