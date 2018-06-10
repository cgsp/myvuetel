<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <slider v-if="sliders.length">
          <div v-for="item in sliders" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="图片加载失败...">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>

        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {
    getRecommend,
    getDiscList
  } from '@api/recommend';
  import {
    ERR_OK
  } from '@api/config';
  import Slider from '@VBase/slider';

  export default {
    name: 'Recommend',
    data() {
      return {
        sliders: []
      };
    },
    created() {
      this._getRecommend();
      getDiscList()
        .then(res => console.log(res));
    },
    methods: {
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.sliders = res.data.slider;
          }
        });
      }
    },
    components: {
      Slider
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
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
    }
  }
</style>
