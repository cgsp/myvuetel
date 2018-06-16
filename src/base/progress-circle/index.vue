<template>
  <div class="progress-circle">
    <!-- viewBox是svg的视口 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <!-- r cx cy都是相对viewBox的相对值 -->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <!--stroke-dasharray总周长  stroke-dashoffset描边的长度，0代表全部描完-->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray" :stroke-dashoffset="dashOffset" />
    </svg>
    <!-- 插槽里面东西的样式，可以在组件外部定义，也可以在组件内部定义 -->
    <slot></slot>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashOffset() {
      return this.dasharray * (1 - this.percent);
    }
  },
  data() {
    return {
      dasharray: Math.PI * 100
    };
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      // stroke: red;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: red;
    }
  }
}
</style>
