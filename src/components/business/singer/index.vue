<template>
  <transition name="slide">
    <div class="singer" ref="singer">
      <listview :data="singers" @selectItem="selectSinger" ref="listview"></listview>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
import { getSingerList } from '@api/singer';
import { ERR_OK } from '@api/config';
import Singer from '@js/singer';
import Listview from '@VBase/listview';
import { mapMutations } from 'vuex';
import { playListMixin } from '@js/mixin';

const HOT_TITLE = '热';
const HOT_LENGTH = 10;
export default {
  name: 'Singer',
  mixins: [playListMixin],
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlayList(playList) {
      const bottomHeight = playList.length > 0 ? '60px' : '0px';
      this.$refs.singer.style.bottom = bottomHeight;
      this.$refs.listview.refresh();
    },
    selectSinger(singer) {
      // console.log(singer);
      this.$router.push(`/singer/${singer.id}`);
      // this.$router.push({
      //   path: `/singer/${singer.id}`
      // });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalLizeSinger(res.data.list);
          // console.log(this.singers);
        }
      });
    },
    _normalLizeSinger(list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        }
      };

      list.forEach((item, index) => {
        if (index < HOT_LENGTH) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });

      let hot = [];
      let ret = [];

      for (let key in map) {
        let value = map[key];
        if (value.title.match(/[a-zA-Z]/)) {
          ret.push(value);
        } else if (value.title === HOT_TITLE) {
          hot.push(value);
        }
      }
      // 对ret数组进行排序
      ret.sort((a, b) => {
        // 这样就是按照A-Z的顺序进行排序的
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    Listview
  }
};
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
@import '@scss/variable.scss';
.slide-leave-active,
.slide-enter-active {
  transition: all 0.3s;
}

.slide-leave-to,
.slide-enter {
  transform: translate3d(-100%, 0, 0);
}

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
