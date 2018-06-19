import { myLocalStorageSet, myLocalStorageGet, myLocalStorageRemove } from '@utils/myStorage';
import { insertArray } from '@utils/myHandleArr';

const SEARCH_KEY = '__search__';

// 最大的存储条数
const SEARCH_MAX_LENGTH = 15;

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

