import { myLocalStorageSet, myLocalStorageGet, myLocalStorageRemove } from '@utils/myStorage';
import { insertArray } from '@utils/myHandleArr';

const SEARCH_KEY = '__search__';

// 最大的存储条数
const SEARCH_MAX_LENGTH = 15;

// 最近播放歌曲
const PLAY_KEY = '__paly__';

const PLAY_MAX_LENGTH = 200;

// 喜欢的歌曲收藏
const FAVORITE_KEY = '__favorite__';

const FAVORITE_MAX_LENGTH = 200;

// 存储的时候，每新插入一条，把之前数组的最后一条删除，插入的新的数据，放在数组的最前面
export function saveSearch(query) {
  let searches = myLocalStorageGet(SEARCH_KEY, []);

  // debugger;

  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH);

  myLocalStorageSet(SEARCH_KEY, searches);

  // 同时return这个新的searches供外界使用
  return searches;
};

export function loadSearch() {
  return myLocalStorageGet(SEARCH_KEY, []);
};

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function deleteSearch(query) {
  let searches = myLocalStorageGet(SEARCH_KEY, []);

  deleteFromArray(searches, (item) => {
    return item === query;
  });

  myLocalStorageSet(SEARCH_KEY, searches);

  // 同时return这个新的searches供外界使用
  return searches;
};

export function clearSearch() {
  myLocalStorageRemove(SEARCH_KEY);

  // 同时return这个新的searches供外界使用
  return [];
};

// 存储的时候，每新插入一条，把之前数组的最后一条删除，插入的新的数据，放在数组的最前面
export function savePlay(song) {
  let playHistory = myLocalStorageGet(PLAY_KEY, []);

  // debugger;

  insertArray(playHistory, song, (item) => {
    return item.id === song.id;
  }, PLAY_MAX_LENGTH);

  myLocalStorageSet(PLAY_KEY, playHistory);

  // 同时return这个新的playHistory供外界使用
  return playHistory;
};

export function loadPlayHistrory() {
  return myLocalStorageGet(PLAY_KEY, []);
};

export function saveFavorite(song) {
  let favoriteList = myLocalStorageGet(FAVORITE_KEY, []);

  insertArray(favoriteList, song, (item) => {
    return item.id === song.id;
  }, FAVORITE_MAX_LENGTH);

  myLocalStorageSet(FAVORITE_KEY, favoriteList);

  // 同时return这个新的favoriteList供外界使用
  return favoriteList;
};

export function deleteFavorite(song) {
  let favoriteList = myLocalStorageGet(FAVORITE_KEY, []);

  deleteFromArray(favoriteList, (item) => {
    return item.id === song.id;
  });

  myLocalStorageSet(FAVORITE_KEY, favoriteList);

  // 同时return这个新的favoriteList供外界使用
  return favoriteList;
};

export function loadFavoriteList() {
  return myLocalStorageGet(FAVORITE_KEY, []);
};


