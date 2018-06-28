import { playMode } from '@js/config';
import { loadSearch, loadPlayHistrory, loadFavoriteList } from '@js/cache';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  // 当前播放的列表
  playList: [],
  // 顺序播放的列表
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  recommendDetail: {},
  rankDetail: {},
  searchHistory: loadSearch(),
  playHistory: loadPlayHistrory(),
  favoriteList: loadFavoriteList()
};

export default state;
