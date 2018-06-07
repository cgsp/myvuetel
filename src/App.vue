<template>
  <div id="app">
    <v-header></v-header>
    <keep-alive>
    <router-view :seller="seller" />

    </keep-alive>
    <!-- <router-view :seller="seller" /> -->
  </div>
</template>

<script type='text/ecmascript-6'>
import VHeader from '@VDashboard/header';
export default {
  name: 'App',
  data() {
    return {
      seller: {
        name: 'gsp'
      }
    };
  },
  components: {
    VHeader
  }
};
</script>

<style rel='stylesheet/scss' lang='scss'>
// @import './common/scss/index.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
