<template>
  <div class="d3-banner" v-if="autoplay">
    <carousel-3d :autoplay="autoplay" :autoplayTimeout="3000" :autoplayHoverPause="true" :border="0" :width="width" :height="height" :space="space" :perspective="60" :bias="'right'" @after-slide-change="afterSlideChanged" :on-main-slide-click="onMainSlideClick">
      <slide :index="0">
        <img src="./1.jpg" alt="pic">
      </slide>
      <slide :index="1">
        <img src="./2.jpg" alt="pic">
      </slide>
      <slide :index="2">
        <img src="./3.jpg" alt="pic">
      </slide>
      <slide :index="3">
        <img src="./4.jpeg" alt="pic">
      </slide>
    </carousel-3d>
    <div v-if="showDot" class="dots">
      <span class="dot" :class="{active: currentIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
    <div class="log">{{log}}</div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  name: "D3Banner",
  data() {
    return {
      width: 0,
      height: 0,
      space: 0,
      currentIndex: 0,
      dots: [1, 2, 3, 4],
      log: "",
      autoplay: true
    };
  },
  props: {
    showDot: {
      type: Boolean,
      default: true
    }
  },
  created() {
    let innerWidth = window.innerWidth;
    if (innerWidth > 640) {
      innerWidth = 640;
    }
    this.width = innerWidth * 0.76;
    this.height = innerWidth * 0.39;
    this.space = innerWidth * 0.6;
  },
  mounted() {
    this.autoplay = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    setTimeout(() => {
      this.autoplay = true;
    }, 20);
  },
  methods: {
    afterSlideChanged(currentIndex) {
      // console.log(currentIndex);
      this.currentIndex = currentIndex;
    },
    onMainSlideClick() {
      // alert("跳转");
      // alert(this.currentIndex);
      this.$router.push("/dash/recommend");
    }
  },
  components: {
    Carousel3d,
    Slide
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
.d3-banner {
  width: 100%;
  margin: 0 auto;
  max-width: 640px;
  overflow: hidden;
  height: 100%;
  background-color: #fff;
  position: relative;
  left: 0;
  top: 0;
  .carousel-3d-container {
    margin-top: 0px;
    margin-bottom: 0px;
    .carousel-3d-slide {
      border-color: transparent;
      background-color: transparent;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .log {
    color: red;
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 1px;
    transform: translate3d(1px, 0, 0);
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #fff;
      &.active {
        width: 20px;
        border-radius: 5px;
        background-color: #fc4d2c;
      }
    }
  }
}
</style>
