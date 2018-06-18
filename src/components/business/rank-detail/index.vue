<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
import MusicList from '@VBusiness/music-list';
import { mapGetters } from 'vuex';
import { getMusicList } from '@api/rank';
import { ERR_OK } from '@api/config';
import { createSong } from '@js/song';
export default {
  name: 'RankDetail',
  computed: {
    title() {
      return this.rankDetail.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      } else {
        return this.rankDetail.picUrl;
      }
    },
    ...mapGetters(['rankDetail'])
  },
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.rankDetail.id) {
        this.$router.back();
        return;
      }
      getMusicList(this.rankDetail.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normallizeSongs(res.songlist);
        }
      });
    },
    _normallizeSongs(list) {
      let temp = [];
      list.forEach(item => {
        const musicData = item.data;
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
