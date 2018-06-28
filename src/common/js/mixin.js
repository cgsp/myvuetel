import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from '@js/config';
import { myShuffle } from '@utils/myHandleArr';

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList(newList) {
      this.handlePlayList(newList);
    }
  },
  methods: {
    handlePlayList(list) {
      throw new Error('组件必须具备 handlePlayList 这个方法');
    }
  }
};

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    getFavotite(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
    },
    toggleFavorite(song) {
      !this.isFavorite(song) ? this.saveFavoriteList(song) : this.deleteFavoriteList(song);
    },
    isFavorite(song) {
      if (!this.favoriteList.length) {
        return false;
      }
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      if (index > -1) {
        return true;
      }
      return false;
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = myShuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }

      // 修改当前的播放列表
      this.setPlayList(list);
      // 修改当前的播放列表，但是希望当前播放的歌曲不变，也就是currentSong不变
      this._resetCurrentyIndex(list);
    },
    _resetCurrentyIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURREENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }

};
