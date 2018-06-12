<template>
  <div class="singer">
    singer
  </div>
</template>

<script type='text/ecmascript-6'>
  import {
    getSingerList
  } from '@api/singer';
  import {
    ERR_OK
  } from '@api/config';
  import Singer from '@js/singer';

  const HOT_TITLE = '热门';
  const HOT_LENGTH = 10;
  export default {
    name: 'Singer',
    data() {
      return {
        singers: []
      };
    },
    created() {
      this._getSingerList();
    },
    methods: {
      _getSingerList() {
        getSingerList()
          .then((res) => {
            if (res.code === ERR_OK) {
              this.singers = res.data.list;
              // console.log(this.singers);
              console.log(this._normalLizeSinger(this.singers));
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
          return (a.title.charCodeAt(0) - b.title.charCodeAt(0));
        });

        return hot.concat(ret);
      }
    }
  };
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
  @import "@scss/variable.scss";
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
