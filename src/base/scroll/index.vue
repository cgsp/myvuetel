<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll';
export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    upPullRefresh: {
      type: Boolean,
      default: false
    },
    downPullRefresh: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });

      // 如果需要监听滚动事件，就派发scroll事件给外界
      // better-scroll里面的this发生了改变
      const me = this;
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          me.$emit('scroll', pos);
        });
      }

      // 如果需要支持上拉刷新的话
      if (this.upPullRefresh) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('toBottomEnd');
          }
          // console.log(this.scroll.y);
        });
      }

      // 如果需要支持下拉重新加载的话
      if (this.downPullRefresh) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y - 0 === 0) {
            this.$emit('toUpEnd');
          }
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
</style>
