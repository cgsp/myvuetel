<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <div class="slider-wrapper">
          <slider v-if="sliders.length">
            <div v-for="item in sliders" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="图片加载失败..." @load="imgLoad">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" class="item" :key="index" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="图片加载中...">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="load-container" v-if="!discList.length">
        <loading :title="'拼命加载中...'"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getRecommend, getDiscList } from '@api/recommend';
import { ERR_OK } from '@api/config';
import Slider from '@VBase/slider';
import Scroll from '@VBase/scroll';
import Loading from '@VBase/loading';
import { playListMixin } from '@js/mixin';
import { mapMutations } from 'vuex';

export default {
  name: 'Recommend',
  mixins: [playListMixin],
  data() {
    return {
      sliders: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setRecommendDetail(item);
    },
    handlePlayList(playList) {
      const bottomHeight = playList.length > 0 ? '60px' : '0px';
      this.$refs.recommend.style.bottom = bottomHeight;
      this.$refs.scroll.refresh();
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.sliders = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    imgLoad() {
      if (!this.checked) {
        this.$refs.scroll.refresh();
        this.checked = true;
      }
    },
    ...mapMutations({
      setRecommendDetail: 'SET_RECOMMEND_DETAIL'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0px;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: flex-start;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
          }
        }
      }
    }
    .load-container {
      width: 100%;
      height: calc(60%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
