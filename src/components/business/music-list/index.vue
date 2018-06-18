<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 图片上面的遮罩层 -->
      <div class="filter" ref="filter"></div>
      <!-- 开始播放按钮 -->
      <div class="play-wrapper">
        <div class="play" v-show="songs.length" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>

    <!-- 蒙层 -->
    <div class="bg-layer" ref="bgLayer"></div>

    <!-- scroll节点一定要定高度 -->
    <scroll @scroll="scroll" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :rank="rank" @clickSong="clickSong" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading :title="'拼命加载中...'"></loading>
      </div>
    </scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
import Scroll from '@VBase/scroll';
import SongList from '@VBase/song-list';
import Loading from '@VBase/loading';

import { prefixStyle } from '@utils/myDom';
import { mapActions } from 'vuex';
import { playListMixin } from '@js/mixin';

const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

export default {
  name: 'MusicList',
  mixins: [playListMixin],
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    clickSong(song, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    handlePlayList(playList) {
      const bottomHeight = playList.length > 0 ? '60px' : '0px';
      const scroll = this.$refs.list;
      scroll.$el.style.bottom = bottomHeight;
      scroll.refresh();
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  mounted() {
    this.bgImageHeight = this.$refs.bgImage.clientHeight;
    this.$refs.list.$el.style.top = `${this.bgImageHeight}px`;
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      const percent = Math.abs(newY / this.bgImageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }

      // 蒙层移动
      let translateY = Math.max(-this.bgImageHeight + 40, newY);
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${translateY}px,0)`;

      // 设置顶部背景的样子
      if (newY < -this.bgImageHeight + 40) {
        this.$refs.bgImage.style.paddingTop = '0px';
        this.$refs.bgImage.style.height = '40px';
        zIndex = 10;
        this.$refs.playBtn.style.display = 'none';
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = '0px';
        this.$refs.playBtn.style.display = 'block';
      }
      this.$refs.bgImage.style.zIndex = zIndex;

      // 顶部背景图片放大与缩小
      this.$refs.bgImage.style[transform] = `scale(${scale})`;

      // 往上移动的时候，顶部背景图片的模糊效果--只有ios有这个效果
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';
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
      background-color: rgba(7, 17, 27, 0.4);
    }
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: top;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          @extend .icon-play;
          margin-right: 0;
          font-size: $font-size-small;
        }
      }
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-background;
  }
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
  }
}
</style>
