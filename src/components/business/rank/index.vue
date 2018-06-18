<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <ul>
        <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, $index) in item.songList" :key="$index">
              <span>{{$index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!topList.length">
      <loading :title="'拼命加载中...'"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import Loading from '@VBase/loading';
import { getTopList } from '@api/rank';
import { ERR_OK } from '@api/config';
import Scroll from '@VBase/scroll';
import { playListMixin } from '@js/mixin';
import { mapMutations } from 'vuex';

export default {
  name: 'Rank',
  mixins: [playListMixin],
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setRankDetail(item);
    },
    handlePlayList(playList) {
      const bottomHeight = playList.length > 0 ? '60px' : '0px';
      this.$refs.rank.style.bottom = bottomHeight;
      this.$refs.scroll.refresh();
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    ...mapMutations({
      setRankDetail: 'SET_RANK_DETAIL'
    })
  },
  components: {
    Loading,
    Scroll
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background-color: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>
