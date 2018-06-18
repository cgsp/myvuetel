import { mapGetters } from 'vuex';

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
