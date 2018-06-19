export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

// getters还可以充当计算属性的作用
export const currentSong = (state) => {
  // 不能直接写currentIndex
  return state.playList[state.currentIndex] || {};
};

export const recommendDetail = state => state.recommendDetail;

export const rankDetail = state => state.rankDetail;

export const searchHistory = state => state.searchHistory;
