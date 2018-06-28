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
  },

  [types.SET_RECOMMEND_DETAIL](state, recommendDetail) {
    state.recommendDetail = recommendDetail;
  },

  [types.SET_RANK_DETAIL](state, rankDetail) {
    state.rankDetail = rankDetail;
  },

  [types.SET_SEARCH_HISTORY](state, searchHistory) {
    state.searchHistory = searchHistory;
  },

  [types.SET_PLAY_HISTORY](state, playHistory) {
    state.playHistory = playHistory;
  },

  [types.SET_FAVORITE_LIST](state, favoriteList) {
    state.favoriteList = favoriteList;
  }
};

export default mutations;
