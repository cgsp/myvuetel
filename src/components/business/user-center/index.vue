<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="tabs-wrapper">
        <tabs :tabs="tabs" @changeTab="changeTab" :currentIndex="currentIndex"></tabs>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll v-if="currentIndex===0" :data="favoriteList" class="list-scroll" ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @clickSong="clickSong"></song-list>
          </div>
        </scroll>
        <scroll v-if="currentIndex===1" :data="playHistory" class="list-scroll" ref="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @clickSong="clickSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResultShow">
        <no-result :title="noResultDesc"></no-result>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">一首歌曲已经添加</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
import Tabs from '@VBase/tabs';
import Scroll from '@VBase/scroll';
import SongList from '@VBase/song-list';
import { mapGetters, mapActions } from 'vuex';
import { playListMixin } from '@js/mixin';
import Song from '@js/song';
import TopTip from '@VBase/top-tip';
import NoResult from '@VBase/no-result';
export default {
  name: 'UserCenter',
  mixins: [playListMixin],
  data() {
    return {
      tabs: [{ name: '我喜欢' }, { name: '最近聆听' }],
      currentIndex: 0
    };
  },
  computed: {
    noResultShow() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '快去收藏歌曲吧';
      } else {
        return '最近一直没听歌';
      }
    },
    ...mapGetters(['playHistory', 'favoriteList'])
  },
  methods: {
    handlePlayList(playList) {
      const bottomHeight = playList.length > 0 ? '60px' : '0px';
      this.$refs.listWrapper.style.bottom = bottomHeight;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playHistory && this.$refs.playHistory.refresh();
    },
    back() {
      this.$router.back();
    },
    changeTab(index) {
      this.currentIndex = index;
    },
    clickSong(song, index) {
      // 注意，这个song，是localStorage的，不是一个song的实例
      this.insertSong(new Song(song));
      this.$refs.topTip.show();
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      // list.forEach(element => {
      //   element = new Song(element);
      // });
      if (list.length === 0) {
        return;
      }
      list = list.map(element => {
        return new Song(element);
      });
      this.randomPlay({ list });
    },
    ...mapActions(['insertSong', 'randomPlay'])
  },
  components: {
    Tabs,
    Scroll,
    SongList,
    TopTip,
    NoResult
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, -100%, 0);
}
.user-center {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 200;
  background: $color-background;
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
  .tabs-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
    }
    .list-inner {
      padding: 20px 30px;
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>
