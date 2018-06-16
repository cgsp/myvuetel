<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="toMini">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="isRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-wrapper">
              <div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{newCurrentTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{duration}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" :class="disable">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="disable">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay" :class="disable">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="disable">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite" :class="disable"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="toNormal">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="isRotate">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control contorl-circle" @click.stop="togglePlay">
          <progress-circle :radius="30" :percent="percent">
            <i :class="playIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="canplay" @error="error" @timeupdate="timeupdate"></audio>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters, mapMutations } from 'vuex';
import createAnimations from 'create-keyframe-animation';
import { prefixStyle } from '@utils/myDom';
import { myTransSecondsToTime } from '@utils/myTime';
import ProgressBar from '@VBase/progress-bar';
import ProgressCircle from '@VBase/progress-circle';

const transform = prefixStyle('transform');

export default {
  name: 'Player',
  computed: {
    isRotate() {
      return this.playing ? 'play' : 'play pause';
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    disable() {
      return this.songReady ? '' : 'disable';
    },
    newCurrentTime() {
      return myTransSecondsToTime(this.currentTime);
    },
    duration() {
      return myTransSecondsToTime(this.currentSong.duration);
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  data() {
    return {
      songReady: false,
      currentTime: 0
    };
  },
  methods: {
    toMini() {
      this.setFullScreen(false);
    },
    toNormal() {
      this.setFullScreen(true);
    },
    enter(ele, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.3)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      };

      // 注册动画
      createAnimations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 800,
          easing: 'linear'
        }
      });

      // 执行动画，并且进入afterEnter回调
      createAnimations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter() {
      // 取消注册
      createAnimations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave(ele, done) {
      this.$refs.cdWrapper.style.transition = 'all .8s';
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style[transform] = '';
    },
    togglePlay() {
      this.setPlayingState(!this.playing);
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    canplay() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    percentChange(percent) {
      if (percent >= 1) {
        this.next();
        return;
      }

      // 如果是暂停的话, 只要一拖动，就播放
      if (!this.playing) {
        this.togglePlay();
      }
      this.$refs.audio.currentTime = percent * this.currentSong.duration;
    },
    _getPosAndScale() {
      // 获取初始状态下，cd这个大圆，向cd的小圆，偏移的量，变小的量
      const targetWidth = 40; // 小圆的宽度
      const paddingLeft = 40; // 小圆距离左边的距离
      const paddingBottom = 30; // 小圆圆心距离底部的距离
      const paddingTop = 80; // 大圆圆心距离顶部的距离
      const cdWidth = window.innerWidth * 0.8;
      const scale = targetWidth / cdWidth;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingBottom - paddingTop - cdWidth / 2;
      return { x, y, scale };
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURREENT_INDEX'
    })
  },
  watch: {
    currentSong(val) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        audio.play();
      });
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 100%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text;
            font-size: $font-size-medium;
            &.current {
              color: #ffcd32;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          &.time-l {
            text-align: left;
            margin-right: 10px;
          }
          &.time-r {
            text-align: right;
            margin-left: 10px;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: #cccccc;
          }
          i {
            font-size: 30px;
            line-height: 40px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-not-favorite {
          color: $color-theme;
        }
        .icon-favorite {
          color: red;
        }
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: $color-highlight-background;
    z-index: 151;
    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 5s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 15px 10px;
      .icon-play,
      .icon-pause,
      .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 29px;
        position: absolute;
        left: 0;
        top: 1px;
      }
    }
    .contorl-circle {
      padding: 7px 10px 0px 10px;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .normal-enter-active,
  .normal-leave-active {
    transition: all 0.5s;
    .top,
    .bottom {
      transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  .normal-enter,
  .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(100px, -100px, 100px);
    }
    .bottom {
      transform: translate3d(-100px, 100px, 100px);
    }
  }

  .mini-enter-active,
  .mini-leave-active {
    transition: all 0.5s;
  }
  .mini-enter,
  .mini-leave-to {
    opacity: 0;
  }
}
</style>
