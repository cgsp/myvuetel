import { myJsonp } from '@utils/myJsonp';

// 引入我们定义的常量(qq音乐jsonp请求的一些常量)
import {
  commonParams,
  options
} from './config.js';

function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const params = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    // 控制分页的，可以自己试试分页
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  });
  return myJsonp(url, params, options);
};

function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

  const params = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    // 控制分页的，可以自己试试分页
    begin: 0,
    num: 100,
    songstatus: 1,
    g_tk: 1664029744,
    singermid: singerId
  });

  return myJsonp(url, params, options);
};

export { getSingerList, getSingerDetail };
