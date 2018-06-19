<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click="cancle">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancle" class="operate-btn">{{cancleBtnText}}</div>
            <div @click="confirm" class="operate-btn left">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancleBtnText: {
      type: String,
      default: '取消'
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
    },
    hide() {
      this.showFlag = false;
    },
    cancle() {
      this.showFlag = false;
      this.$emit('cancle');
    },
    confirm() {
      this.showFlag = false;
      this.$emit('confirm');
    }
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-scale {
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

.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: rgba(255, 255, 255, 0.3);
  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.5s;
    .confirm-content {
      animation: confirm-scale 0.5s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: #ffcd32;
      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-large;
        color: #fff;
        font-weight: 700;
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
          &.left {
            border-left: 1px solid #fff;
          }
        }
      }
    }
  }
}
</style>
