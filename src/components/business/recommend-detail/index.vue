<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
import MusicList from '@VBusiness/music-list';
import { mapGetters } from 'vuex';
import { getSongList } from '@api/recommend';
import { ERR_OK } from '@api/config';
import { createSong } from '@js/song';
export default {
  name: 'RecommendDetail',
  computed: {
    title() {
      return this.recommendDetail.dissname;
    },
    bgImage() {
      return this.recommendDetail.imgurl;
    },
    ...mapGetters(['recommendDetail'])
  },
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.recommendDetail.dissid) {
        this.$router.back();
        return;
      }
      getSongList(this.recommendDetail.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normallizeSongs(res.cdlist[0].songlist);
          // console.log(this.songs);
        }
      });
    },
    _normallizeSongs(list) {
      let temp = [];
      list.forEach(musicData => {
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
@import '@scss/variable.scss';
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
