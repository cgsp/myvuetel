import { myJsonp } from '@js/myJsonp';
import { myAxios } from '@js/myAxios';
import { commonParams, options } from './config';
const dev = process.env.NODE_ENV !== 'production';

function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const params = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return myJsonp(url, params, options);
};

function getDiscList() {
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  // 上面的直接获取的方式是不行的，因为这个接口只允许reffer是QQ的服务器才能请求
  const url = dev ? '/api/getDiscList' : 'http://ustbhuangyi.com/music/api/getDiscList';
  const params = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });


  // return myAxios.get(url, {
  //   params: params
  // })
  // .then((res) => {
  //   return Promise.resolve(res.data);
  // });

  return new Promise((resolve, reject) => {
    myAxios.get(url, { params: params })
      .then((res) => {
        resolve(res.data);
      })
      .catch(err => reject(err));
  });
};

export { getRecommend, getDiscList };