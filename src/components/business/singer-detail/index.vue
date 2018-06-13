<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bg-image="singer.avatar"></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import {
    mapGetters
  } from 'vuex';

  import {
    getSingerDetail
  } from '@api/singer';

  import {
    ERR_OK
  } from '@api/config';

  import {
    createSong
  } from '@js/song';

  import MusicList from '@VBusiness/music-list';

  export default {
    name: 'SingerDetail',
    data() {
      return {
        songs: []
      };
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      this._getSingerDetail(this.singer.id);
    },
    methods: {
      _getSingerDetail(singerId) {
        getSingerDetail(singerId)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.songs = this._normallizeSongs(res.data.list);
              // console.log(this.songs);
            }
          });
      },
      _normallizeSongs(list) {
        let temp = [];
        list.forEach(element => {
          let {
            musicData
          } = element;

          if (musicData.songid && musicData.albummid) {
            temp.push(createSong(musicData));
          }
        });

        return temp;
      }
    },
    components: {
      MusicList
    }
  };
</script>

<style scoped rel='stylesheet/scss' lang='scss'>
  @import "@scss/variable.scss";
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
