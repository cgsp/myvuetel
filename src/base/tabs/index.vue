<template>
  <ul class="tabs">
    <li class="tab-item" v-for="(tab,index) in tabs" :key="index" :class="{'active':index===currentIndex}" @click="changeTab(index)">
      <span>{{tab.name}}</span>
    </li>
  </ul>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'Tabs',
  data() {
    return {};
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [{ name: '选项1' }, { name: '选项2' }];
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeTab(index) {
      this.$emit('changeTab', index);
    }
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.tabs {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  .tab-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active {
      background-color: #000;
      color: #ffcd32;
    }
  }
}
</style>
