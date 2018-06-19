<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" ref="query" class="box" :placeholder="placeholder" v-model="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type='text/ecmascript-6'>
import { myThrottle } from '@utils/myThrottle';
export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    };
  },
  created() {
    this.$watch(
      'query',
      myThrottle((newQuery, oldQuery) => {
        this.$emit('queryChange', newQuery);
      }, 300)
    );
  },
  methods: {
    clear() {
      this.query = '';
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      this.$refs.query.blur();
    }
  }
};
</script>
<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background-color: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: #ffcd32;
    line-height: 40px;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    padding-left: 10px;
    line-height: 18px;
    background-color: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
    &:focus {
      border: 2px solid #ffcd32;
      height: 25px;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: #ffcd32;
    line-height: 40px;
  }
}
</style>
