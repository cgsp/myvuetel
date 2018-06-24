import { commonParams, options } from './config';
import { myAxios } from '@utils/myAxios';
import { myJsonp } from '@utils/myJsonp';
import { getUid } from '@js/uid';

const dev = process.env.NODE_ENV !== 'production';

export function getLyric(mid) {
  const url = dev ? 'lyric' : 'http://ustbhuangyi.com/music/api/lyric';
  // const url = '/lyric';
  // const url = dev ? '/api/lyric' : 'http://ustbhuangyi.com/music/api/lyric';

  const params = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  });

  return myAxios.get(url, {
    params: params
  }).then((res) => {
    return Promise.resolve(res.data);
  });
};

export function getVKey(songmid, filename) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

  const params = Object.assign({}, commonParams, {
    cid: 205361747,
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
  });

  return myJsonp(url, params, Object.assign({}, options, {
    param: 'callback'
  }));
};
