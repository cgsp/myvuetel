import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from '@js/config';
import { myShuffle } from '@utils/myHandleArr';
import { login } from '@api/login';
// import { myLocalStorageSet, myLocalStorageGet } from '@utils/myStorage';
import { myLocalStorageSet } from '@utils/myStorage';
// import CryptoJS from 'crypto-js';


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

export const loginMixin = {
  data() {
    return {
      username: '',
      password: '',
      tipTitle: '',
      tipContent: '',
      loadingShow: false
    };
  },
  created() {
    // this.username = myLocalStorageGet('username', '');
    // this.password = myLocalStorageGet('password', '');
  },
  methods: {
    login() {
      if (!this.username) {
        this.showTip('请输入用户名！');
        return;
      }
      if (!this.password) {
        this.showTip('请输入密码！');
        return;
      }


      const username = $.trim(this.username);
      const password = $.trim(this.password);

      if (username === 'admin' && password === '123456') {
        myLocalStorageSet('hasLogin', true);
        setTimeout(() => {
          this.$router.push({
            path: '/dash'
          });
        }, 100);
        // this.$router.push({
        //   path: '/dash'
        // });
        return;
      }

      this.showTip('用户名或密码错误');

      // let password = $.trim(this.password);
      // password = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
      // this._login(username, password);
    },
    showTip(title, content) {
      this.tipTitle = title;
      this.tipContent = content || '';
      this.$refs.middleTip.show();
    },
    _login(username, password) {
      this.loadingShow = true;
      login(username, password)
        .then(res => {
          if (res && res.error === 0) {
            this.loadingShow = false;
            const token = res.token;
            myLocalStorageSet('token', token);
            myLocalStorageSet('username', this.username);
            myLocalStorageSet('password', this.password);
            this.$router.push({
              path: 'charts'
            });
          } else {
            this.loadingShow = false;
            this.tipTitle = res.msg;
            this.tipContent = '';
            this.$refs.middleTip.show();
          }
        })
        .catch(error => {
          console.log(error);
          this.tipTitle = '网络问题，请刷新页面重试';
          this.tipContent = '';
          this.loadingShow = false;
          this.$refs.middleTip.show();
        });
    }
  }
};
