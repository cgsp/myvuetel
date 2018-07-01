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
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="isRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{ 'current': currentLyricLineNum === index }" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{newCurrentTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{duration}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" :class="disable" @click="changeMode">
              <i :class="iconMode"></i>
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
              <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavotite(currentSong)"></i>
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
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放列表组件 -->
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSong.url" @play="canplay" @error="error" @timeupdate="timeupdate" @ended="end"></audio>
  </div>
</template>

<script type='text/ecmascript-6'>
// import { mapGetters, mapMutations } from 'vuex';
import { mapActions } from 'vuex';
import createAnimations from 'create-keyframe-animation';
import { prefixStyle } from '@utils/myDom';
// 放到mixin中
// import { myShuffle } from '@utils/myHandleArr';
import { myTransSecondsToTime } from '@utils/myTime';
import ProgressBar from '@VBase/progress-bar';
import ProgressCircle from '@VBase/progress-circle';
import { playMode } from '@js/config';
import LyricParser from 'lyric-parser';
// import { ERR_OK } from '@api/config';
import Scroll from '@VBase/scroll';
import PlayList from '@VBusiness/play-list';
import { playerMixin } from '@js/mixin';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

export default {
  name: 'Player',
  mixins: [playerMixin],
  created() {
    this.touches = {};
  },
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
    }
    // 放到mixin中
    // iconMode() {
    //   return this.mode === playMode.sequence
    //     ? 'icon-sequence'
    //     : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    // },
    // ...mapGetters([
    //   'fullScreen',
    //   'playList',
    //   'currentSong',
    //   'playing',
    //   'currentIndex',
    //   'mode',
    //   'sequenceList'
    // ])
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLyricLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    };
  },
  methods: {
    showPlayList() {
      this.$refs.playList.show();
    },
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
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style[transform] = '';
    },
    togglePlay() {
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlay();
        }
      }

      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlay();
        }
      }

      this.songReady = false;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      const audio = this.$refs.audio;
      audio.currentTime = 0;
      audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    canplay() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    error() {
      this.songReady = true;
    },
    middleTouchStart(e) {
      this.touches.init = true;
      const touch = e.touches[0];
      this.touches.x1 = touch.pageX;
      this.touches.y1 = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touches.init) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touches.x1;
      const deltaY = touch.pageY - this.touches.y1;
      // 我们只支持横向滚动，如果纵向的滚动大于横向的滚动，我们就认为其是纵向的滚动，那么什么都不做
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      // console.log(deltaX);

      // 歌词的dom初始位置
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      // 歌词的dom实时滚动的距离
      const offset = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      this.touches.percent = Math.abs(offset / window.innerWidth);
      // 移动的时候的滚动是实时的，所以过渡时间是0s
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offset}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = '0s';
      this.$refs.middleL.style.opacity = 1 - this.touches.percent;
      this.$refs.middleL.style[transitionDuration] = '0s';
    },
    middleTouchEnd() {
      this.touches.init = false;
      let offset;
      let opacity;
      if (this.currentShow === 'cd') {
        if (this.touches.percent > 0.2) {
          this.currentShow = 'lyric';
          offset = -window.innerWidth;
          opacity = 0;
        } else {
          offset = 0;
          opacity = 1;
        }
      } else {
        if (this.touches.percent < 0.8) {
          this.currentShow = 'cd';
          offset = 0;
          opacity = 1;
        } else {
          offset = -window.innerWidth;
          opacity = 0;
        }
      }
      // 移动的时候的滚动是带过渡效果的，所以过渡时间是.3s
      this.$refs.lyricList.$el.style[transitionDuration] = '.3s';
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offset}px,0,0)`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = '.3s';
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
      if (this.currentLyric) {
        this.currentLyric.seek(percent * this.currentSong.duration * 1000);
      }
    },
    // 放到mixin中
    // changeMode() {
    //   const mode = (this.mode + 1) % 3;
    //   this.setPlayMode(mode);
    //   let list = null;
    //   if (mode === playMode.random) {
    //     list = myShuffle(this.sequenceList);
    //   } else {
    //     list = this.sequenceList;
    //   }

    //   // 修改当前的播放列表
    //   this.setPlayList(list);
    //   // 修改当前的播放列表，但是希望当前播放的歌曲不变，也就是currentSong不变
    //   this._resetCurrentyIndex(list);
    // },
    // _resetCurrentyIndex(list) {
    //   let index = list.findIndex(item => {
    //     return item.id === this.currentSong.id;
    //   });

    //   this.setCurrentIndex(index);
    // },
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
    _getLyric() {
      this.currentSong.getLyric().then(lyric => {
        if (this.currentSong.lyric !== lyric) {
          return;
        }
        this.currentLyric = new LyricParser(lyric, this._handleLyric);
        if (this.playing) {
          this.currentLyric.play();
        }
      });
    },
    _handleLyric({ lineNum, txt }) {
      this.currentLyricLineNum = lineNum;
      if (lineNum > 5 && this.playing) {
        const lines = this.$refs.lyricLine;
        let currentLine = lines[lineNum - 5];
        this.$refs.lyricList.scrollToElement(currentLine, 1000);
      } else {
        // 滚动到顶部
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    ...mapActions(['savePlayHistory'])
    // 放到mixin中
    // ...mapMutations({
    //   setFullScreen: 'SET_FULL_SCREEN',
    //   setPlayingState: 'SET_PLAYING_STATE',
    //   setCurrentIndex: 'SET_CURREENT_INDEX',
    //   setPlayMode: 'SET_PLAY_MODE',
    //   setPlayList: 'SET_PLAY_LIST'
    // })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      // this.$nextTick(() => {
      //   const audio = this.$refs.audio;
      //   audio.play();
      //   // 给这个当前的song，获取其歌词
      //   this._getLyric();
      // });
      // 换成下面的写法，可以保证切换到后台的话，再切换回来，还会执行
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        const audio = this.$refs.audio;
        audio.play();
        // 给这个当前的song，获取其歌词
        this._getLyric();
      }, 1000);
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
    ProgressCircle,
    Scroll,
    PlayList
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
    z-index: 100000;
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
            color: #ffcd32;
            opacity: 0.5;
            letter-spacing: 2;
            animation: toScale 10s linear infinite;
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
            background: #ffcd32;
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
    z-index: 100001;
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

  @keyframes toScale {
    0% {
      transform: scale(0);
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
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
