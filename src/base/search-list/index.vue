<template>
  <div class="search-list" v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li class="search-item" v-for="(item, index) in searches" :key="index" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop.prevent="dele(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    dele(item) {
      this.$emit('delete', item);
    }
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
@import '@scss/mixin.scss';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: #ffcd32;
      }
    }
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  transform: translate3d(100%, -100%, 0) scale(1.7);
}
</style>
