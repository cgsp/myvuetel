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
    startY: {
      type: Number,
      default: 0
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
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
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
        click: this.click,
        startY: this.startY
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

      // 开始滚动的话，告诉外界
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('startScroll');
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
      // 用法
      // this.$refs.scroll.scrollTo(0, -40 * index, 500);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      // 用法
      // this.$ref.scroll.scrollToElement(this.$refs.listItems[index], 200);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
        // 有时候，如果外界有缓冲动画的话，20毫秒是不够的，需要外界手动设置更新的时间
      }, this.refreshDelay);
    }
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
</style>
