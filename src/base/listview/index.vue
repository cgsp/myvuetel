<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listviewItem">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,$index) in group.items" class="list-group-item" :key="$index" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.prevent.stop="onShortCutTouchStart" @touchmove.prevent.stop="onShortCutTouchMove">
      <ul>
        <li v-for="(item, index) in shotCutList" :key="index" class="item" :data-index="index" :class="{'current':index===currentIndex}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY < 0" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading :title="'拼命加载中...'"></loading>
    </div>
  </scroll>
</template>

<script type='text/ecmascript-6'>
import Scroll from '@VBase/scroll';
import Loading from '@VBase/loading';
import { handleMyDataAttr } from '@utils/myDom';

const ANCHOR_HEIGHT = 18;

export default {
  name: 'Listview',
  created() {
    // 不需要观察的数据，一般都在这个地方定义
    this.touch = {};
    this.listenScroll = true;
    this.probeType = 3;
    // 左边每个group的高度的集合
    this.listHeightArr = [];
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  computed: {
    shotCutList() {
      return this.data.map(item => item.title);
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : '';
    }
  },
  methods: {
    refresh() {
      console.log('调用了');
      this.$refs.listview.refresh();
    },
    onShortCutTouchStart(e) {
      // 注意，这个地方获取的是string
      let anthorIndex = handleMyDataAttr(e.target, 'index') - 0;
      this._srcollTo(anthorIndex);
      this.touch.y1 = e.touches[0].pageY;
      this.touch.anthorIndex = anthorIndex;
    },
    onShortCutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anthorIndex = this.touch.anthorIndex + delta;
      this._srcollTo(anthorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
      // console.log(this.scrollY);
    },
    selectItem(item) {
      this.$emit('selectItem', item);
    },
    _srcollTo(index) {
      console.log(index);
      // 如果点击的是边界的或index是null
      if (!index && index !== 0) {
        return;
      }

      if (index < 0) {
        index = 0;
      } else if (index > this.listHeightArr.length - 2) {
        index = this.listHeightArr.length - 2;
      }
      this.scrollY = -this.listHeightArr[index];
      this.$refs.listview.scrollToElement(this.$refs.listviewItem[index], 0);
    },
    _calHeight() {
      this.listHeightArr = [];
      const listItems = this.$refs.listviewItem;
      let height = 0;
      this.listHeightArr.push(height);
      for (let i = 0; i < listItems.length; i++) {
        let item = listItems[i];
        height += item.clientHeight;
        this.listHeightArr.push(height);
      }
      // console.log(this.listHeightArr);
    }
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeightArr = this.listHeightArr;
      // console.log(newY);
      // 当滚动到顶部以上，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 当在中间位置滚动的时候
      for (let i = 0; i < listHeightArr.length - 1; i++) {
        let heightTop = listHeightArr[i];
        let heightBottom = listHeightArr[i + 1];
        // 一定是大于等于
        if (-newY >= heightTop && -newY < heightBottom) {
          this.currentIndex = i;
          this.diff = heightBottom + newY;
          return;
        }
      }
      // 当滚动到底部以下，且-newY大于最后一个元素的上限
      this.currentIndex = listHeightArr.length - 2;
    },
    // 固定导航，顶起来的效果实现
    diff(newDiff) {
      let fixedTop = newDiff > 0 && newDiff < 30 ? newDiff - 30 : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background-color: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
