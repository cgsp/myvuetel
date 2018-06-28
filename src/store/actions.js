import * as types from './mutation-types';
import { playMode } from '@js/config';
import { myShuffle } from '@utils/myHandleArr';
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from '@js/cache';

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}

// { commit, state }, { list, index }---后面的{list,index}是提交的新的数据
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  // 如果此时的播放模式是随机播放的话
  if (state.mode === playMode.random) {
    let randomList = myShuffle(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }

  commit(types.SET_CURREENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function ({ commit, state }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.loop);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = myShuffle(list);
  commit(types.SET_PLAY_LIST, randomList);
  // 从第一首歌曲开始播放
  commit(types.SET_CURREENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 记录下当前的歌曲
  let currentSong = playList[currentIndex];

  // 查找当前列表中，是否有这首歌，有的话返回索引，没的话，返回-1
  let fpIndex = findIndex(playList, song);

  // 因为是插入歌曲，所以索引要+1
  currentIndex++;
  playList.splice(currentIndex, 0, song);

  if (fpIndex > -1) {
    // 如果本来有这首歌
    if (currentIndex > fpIndex) {
      // 当前播放的歌曲，在这首歌的后面
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      // 当前播放的歌曲，在这首歌的前面
      playList.splice(fpIndex + 1, 1);
    }
  }

  // 在当前sequenceList里面的索引
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);

  sequenceList.splice(currentSIndex, 0, song);

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURREENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = function ({ commit, state }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = function ({ commit, state }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = function ({ commit, state }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playList, song);
  playList.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--;
  }

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURREENT_INDEX, currentIndex);

  // // 如果删完了
  // if (!playList.length) {
  //   commit(types.SET_PLAYING_STATE, false);
  // } else {
  //   commit(types.SET_PLAYING_STATE, true);
  // }

  const playingState = playList.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
};

export const clearSongList = function ({ commit, state }, song) {
  commit(types.SET_PLAY_LIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURREENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = function ({ commit, state }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};

export const saveFavoriteList = function ({ commit, state }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song));
};

export const deleteFavoriteList = function ({ commit, state }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
};
