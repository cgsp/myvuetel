<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="queryChange"></search-box>
    </div>
    <div ref="shortCutWrapper" class="shortcut-wrapper" v-show="!query">
      <div class="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="selectKey(item.k)" class="item" v-for="(item, index) in hotKeys" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import SearchBox from '@VBase/search-box';
import Suggest from '@VBusiness/suggest';

import { getHotKey } from '@api/search';
import { ERR_OK } from '@api/config';
export default {
  name: 'Search',
  created() {
    this._getHotKeys();
  },
  data() {
    return {
      hotKeys: [],
      query: ''
    };
  },
  methods: {
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
    }
  },
  components: {
    SearchBox,
    Suggest
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
      color: $color-text-d;
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
