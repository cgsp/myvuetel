<template>
  <transition name="tip-fade">
    <div class="tip" v-show="showFlag" @click="close">
      <div class="tip-wrapper">
        <div class="tip-content">
          <div>
            <p class="text">{{textTitle}}</p>
            <p class="text">{{textContent}}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'MiddleTip',
  props: {
    textTitle: {
      type: String,
      default: ''
    },
    textContent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showFlag = false;
      }, 3000);
    },
    hide() {
      this.showFlag = false;
    },
    close() {
      this.showFlag = false;
    }
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';
@keyframes tip-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes tip-scale {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.6);
  }
  100% {
    transform: scale(1);
  }
}

.tip {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.5);
  &.tip-fade-enter-active {
    animation: tip-fadein 0.5s;
    .tip-content {
      animation: tip-scale 0.5s;
    }
  }

  .tip-wrapper {
    position: fixed;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    z-index: 999;
    .tip-content {
      width: 160px;
      height: 100px;
      border-radius: 13px;
      background: #3a4154;
      padding: 5px;
      position: relative;
      div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .text {
          @include no-wrap();
          width: 100%;
          line-height: 22px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;
        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid #fff;
          color: #fff;
        }
      }
    }
  }
}
</style>
