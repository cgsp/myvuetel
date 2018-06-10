<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type='text/ecmascript-6'>
  import VHeader from '@VDashboard/header';
  import Tab from '@VDashboard/tab';

  export default {
    name: 'App',
    components: {
      VHeader,
      Tab
    }
  };
</script>

<style scoped rel='stylesheet/scss' lang='scss'>

</style>
