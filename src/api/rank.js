import { myJsonp } from '@utils/myJsonp';
import { commonParams, options } from './config';

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const params = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  });

  return myJsonp(url, params, options);
};

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const params = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  });

  return myJsonp(url, params, options);
};
