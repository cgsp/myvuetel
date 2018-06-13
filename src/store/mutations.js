import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },

  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },

  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },

  [types.SET_PLAY_LIST](state, playList) {
    state.playList = playList;
  },

  [types.SET_SEQUENCE_LIST](state, sequenceList) {
    state.sequenceList = sequenceList;
  },

  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },

  [types.SET_CURREENT_INDEX](state, currentIndex) {
    state.currentIndex = currentIndex;
  }
};

export default mutations;
