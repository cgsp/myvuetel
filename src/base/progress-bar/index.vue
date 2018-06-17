<template>
  <div class="progress-bar" ref="box" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="btn" @touchstart.prevent="touchstart" @touchmove.prevent="touchmove" @touchend="touchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { prefixStyle } from '@utils/myDom';
const transform = prefixStyle('transform');
const btnWidth = 16;
export default {
  name: 'ProgressBar',
  created() {
    this.touches = {};
  },
  data() {
    return {};
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  methods: {
    touchstart(e) {
      this.touches.init = true;
      this.touches.x1 = e.touches[0].pageX;
      this.touches.left = this.$refs.progress.clientWidth;
    },
    touchmove(e) {
      // 如果没经历touchstart，直接进入move的话，需要return掉
      if (!this.touches.init) {
        return;
      }

      const deltaX = e.touches[0].pageX - this.touches.x1;
      // 大于0，但是小于boxWidth
      const offSetWidth = Math.min(
        Math.max(this.touches.left + deltaX, 0),
        this.$refs.box.clientWidth - btnWidth
      );

      this._offet(offSetWidth);
    },
    touchend() {
      this.touches.init = false;
      this._triggerPercent();
    },
    progressClick(e) {
      // console.log(e.pageX);
      // console.log(e.offsetX);
      const left = this.$refs.box.getBoundingClientRect().left;
      this._offet(e.pageX - left);
      this._triggerPercent();
    },
    _offet(offSetWidth) {
      this.$refs.progress.style.width = offSetWidth + 'px';
      this.$refs.btn.style[transform] = `translate3d(${offSetWidth}px,0,0)`;
    },
    _triggerPercent() {
      const boxWidth = this.$refs.box.clientWidth - btnWidth;
      const percent = this.$refs.progress.clientWidth / boxWidth;
      // 派发事件
      this.$emit('percentChange', percent);
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent > 0 && !this.touches.init) {
        const boxWidth = this.$refs.box.clientWidth - btnWidth;
        const offSetWidth = newPercent * boxWidth;
        this._offet(offSetWidth);
      }
    }
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>
