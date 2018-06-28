<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="tabs-wrapper">
        <tabs :tabs="tabs" @changeTab="changeTab" :currentIndex="currentIndex"></tabs>
      </div>
      <div class="play-btn" ref="playBtn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper"></div>
      <div class="no-result-wrapper" v-show="false">
      </div>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
import Tabs from '@VBase/tabs';
export default {
  name: 'UserCenter',
  data() {
    return {
      tabs: [{ name: '我喜欢' }, { name: '最近聆听' }],
      currentIndex: 0
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    changeTab(index) {
      this.currentIndex = index;
    }
  },
  components: {
    Tabs
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, -100%, 0);
}
.user-center {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 200;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .tabs-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
    }
    .list-inner {
      padding: 20px 30px;
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
