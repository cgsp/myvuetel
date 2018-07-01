<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type='text/ecmascript-6'>
import VHeader from '@VDashboard/header';
import Tab from '@VDashboard/tab';
import Player from '@VDashboard/player';

console.log($('#app'));
export default {
  name: 'App',
  components: {
    VHeader,
    Tab,
    Player
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
</style>
