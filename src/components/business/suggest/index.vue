<template>
  <scroll class="suggest" :data="searchResults" :upPullRefresh="true" @toBottomEnd="pullToEnd" :downPullRefresh="true" @toUpEnd="toUpEnd" :beforeScroll="true" @startScroll="startScroll" ref="suggest">
    <ul class="suggest-list">
      <loading v-show="loadAgain" :title="'重新加载...'"></loading>
      <li class="suggest-item" v-for="(item, index) in searchResults" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" :title="'上拉加载更多...'"></loading>
      <li class="suggest-item-down" v-show="!hasMore && searchResults.length">已经到底了...</li>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !searchResults.length && !inLoading">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type='text/ecmascript-6'>
import { search } from '@api/search';
import { ERR_OK } from '@api/config';
import { createSong } from '@js/song';
import Scroll from '@VBase/scroll';
import Loading from '@VBase/loading';
import NoResult from '@VBase/no-result';
import Singer from '@js/singer';
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      zhida: true,
      perpage: 20,
      searchResults: [],
      hasMore: true,
      loadAgain: false,
      inLoading: true
    };
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh();
    },
    startScroll() {
      this.$emit('startScroll');
    },
    selectItem(item) {
      if (item.type === 'singer') {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit('select');
    },
    // 下拉加载更多
    pullToEnd() {
      // 如果下拉到底了，就不加载了
      if (!this.hasMore) {
        return;
      }
      this.page++;
      this._search();
    },
    toUpEnd() {
      console.log('到顶了，要重新刷新一下了');
      this.loadAgain = true;
      this.page = 1;
      this._search();
    },
    getIconClass(item) {
      if (item.type === 'singer') {
        return 'icon-mine';
      }
      return 'icon-music';
    },
    getName(item) {
      if (item.type === 'singer') {
        return item.singername;
      }
      return `${item.name}-${item.singer}`;
    },
    _search() {
      this.hasMore = true;
      this.inLoading = true;
      search(this.query, this.page, this.showSinger, this.perpage).then(res => {
        this.inLoading = false;
        if (res.code !== ERR_OK) {
          return;
        }

        if (this.page === 1) {
          // 如果是第1页的请求
          this.searchResults = this._normalLize(res.data);
          this.loadAgain = false;
        } else {
          // 如果不是第1页的请求
          this.searchResults = this.searchResults.concat(
            this._normalLize(res.data)
          );
        }

        // 判断当前搜索条件下，是否已经加载完了
        const song = res.data.song;
        if (
          !song.list.length ||
          song.curnum + song.curpage * this.perpage >= song.totalnum
        ) {
          this.hasMore = false;
        }
      });
    },
    _normalLize(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: 'singer' } });
      }
      if (data.song) {
        ret = ret.concat(this._toSong(data.song.list));
      }
      return ret;
    },
    _toSong(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });

      return ret;
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query() {
      // 搜索条件变化了，必须重新重置page，
      // 同时，scroll回到顶部
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      this._search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
    .suggest-item-down {
      width: 80%;
      margin: 0 auto;
      height: 20px;
      line-height: 20px;
      color: red;
      text-align: center;
      border-bottom: 1px dashed red;
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
