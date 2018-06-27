<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @queryChange=queryChange placeholder="请输入搜索关键字"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <tabs :tabs="tabs" :currentIndex="currentIndex" @changeTab="changeTab"></tabs>
        <div class="list-wrapper">
          <scroll v-if="currentIndex===0" :data="playHistory" class="list-scroll" ref="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @clickSong="clickSong"></song-list>
            </div>
          </scroll>
          <scroll v-if="currentIndex===1" :data="searchHistory" class="list-scroll" ref="searchHistory">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="selectSearch" @delete="deleteItem"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="false" @startScroll="startScroll" @select="selectSuggest"></suggest>
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
import SearchBox from '@VBase/search-box';
import Suggest from '@VBusiness/suggest';
import Tabs from '@VBase/tabs';
import Scroll from '@VBase/scroll';
import SongList from '@VBase/song-list';
import SearchList from '@VBase/search-list';
import TopTip from '@VBase/top-tip';
import { mapActions, mapGetters } from 'vuex';
import Song from '@js/song';
export default {
  name: 'addSong',
  data() {
    return {
      showFlag: false,
      query: '',
      currentIndex: 0,
      tabs: [{ name: '最近播放' }, { name: '搜索历时' }]
    };
  },
  computed: {
    ...mapGetters(['searchHistory', 'playHistory'])
  },
  methods: {
    show() {
      this.showFlag = true;
      this.refresh();
    },
    hide() {
      this.showFlag = false;
    },
    queryChange(query) {
      console.log(query);
      this.query = query;
      this.refresh();
    },
    selectSearch(query) {
      this.query = query;
      this.$refs.searchBox.query = query;
      this.$refs.topTip.show();
    },
    startScroll() {
      this.$refs.searchBox.blur();
    },
    selectSuggest() {
      this.saveSearchHistory(this.query);
    },
    changeTab(index) {
      console.log(index);
      this.currentIndex = index;
      this.refresh();
    },
    clickSong(song, index) {
      if (index !== 0) {
        // 注意，这个song，是localStorage的，不是一个song的实例
        this.insertSong(new Song(song));
        this.$refs.topTip.show();
      }
    },
    refresh() {
      if (this.currentIndex === 0) {
        setTimeout(() => {
          this.$refs.playHistory.refresh();
        }, 20);
      } else {
        setTimeout(() => {
          this.$refs.searchHistory.refresh();
        }, 20);
      }
    },
    deleteItem(item) {
      this.deleteSearchHistory(item);
    },
    ...mapActions([
      'saveSearchHistory',
      'selectPlay',
      'insertSong',
      'deleteSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Tabs,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 30px;
      padding-top: 0;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
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
