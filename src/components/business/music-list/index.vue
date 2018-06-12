<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle">
      <div class="filter"></div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: 'MusicList',
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default () {
          return [];
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`;
      }
    },
    data() {
      return {};
    },
    methods: {
      back() {
        this.$router.back();
      }
    }
  };
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
  @import "@scss/variable.scss";
  @import "@scss/mixin.scss";
  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
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
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-theme;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: center center;
      background-size: cover;
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, .4);
      }
    }
  }
</style>
