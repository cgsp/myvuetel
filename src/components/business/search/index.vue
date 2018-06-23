<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="queryChange"></search-box>
    </div>
    <div ref="shortCutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcutArr">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="selectKey(item.k)" class="item" v-for="(item, index) in hotKeys" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历时</span>
              <span class="clear" @click="clearAll">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-List :searches="searchHistory" @select="selectItem" @delete="deleteItem"></search-List>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest :query="query" @startScroll="startScroll" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm :text="'确定情况吗？'" @confirm="confirm" ref="confirm"></confirm>
    <top-tip :delay="delay" ref="topTip">
      <p class="tip">清空成功</p>
    </top-tip>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import SearchBox from '@VBase/search-box';
import Suggest from '@VBusiness/suggest';
import { getHotKey } from '@api/search';
import { ERR_OK } from '@api/config';
import { mapActions, mapGetters } from 'vuex';
import SearchList from '@VBase/search-list';
import Scroll from '@VBase/scroll';
import Confirm from '@VBase/confirm';
import TopTip from '@VBase/top-tip';
import { playListMixin } from '@js/mixin';
export default {
  name: 'Search',
  mixins: [playListMixin],
  created() {
    this._getHotKeys();
    this.timer = null;
  },
  data() {
    return {
      hotKeys: [],
      query: '',
      delay: 2000
    };
  },
  computed: {
    shortcutArr() {
      return this.hotKeys.concat(this.searchHistory);
    },
    ...mapGetters(['searchHistory'])
  },
  methods: {
    handlePlayList(playList) {
      const bottomHeight = playList.length > 0 ? '60px' : '0px';
      // 2个地方都需要refresh
      this.$refs.shortCutWrapper.style.bottom = bottomHeight;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottomHeight;
      this.$refs.suggest.refresh();
    },
    clearAll() {
      this.$refs.confirm.show();
    },
    confirm() {
      this.clearSearchHistory();
      this.$refs.topTip.show();
    },
    selectItem(item) {
      this.selectKey(item);
    },
    deleteItem(item) {
      this.deleteSearchHistory(item);
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    startScroll() {
      this.$refs.searchBox.blur();
    },
    queryChange(newQuery) {
      this.query = newQuery;
    },
    _getHotKeys() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10);
        }
      });
    },
    selectKey(query) {
      this.$refs.searchBox.setQuery(query);
    },
    _refreshScroll() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$refs.shortcut.refresh();
      }, 20);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    shortcutArr() {
      this._refreshScroll();
    },
    query() {
      this._refreshScroll();
    }
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm,
    TopTip
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';

.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
    }
    .hot-key {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
    }
    .title {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: $font-size-medium;
      color: $color-text-l;
    }
    .text {
      flex: 1;
    }
    .clear {
      @include extend-click();
    }
    .icon-clear {
      font-size: $font-size-medium;
      color: #ffcd32;
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
  .tip {
    text-align: center;
    line-height: 40px;
    height: 40px;
  }
}
</style>
