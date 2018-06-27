/*
 * @Author: John.Guan
 * @Date: 2018-06-27 15:26:02
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-06-27 15:26:34
 */


/*
 *
 * 采用formDate方式的示范请求
 */


// import { myJsonp } from '@utils/myJsonp';
import { myAxios } from '@utils/myAxios';
// const dev = process.env.NODE_ENV !== 'production';

// function getRecommend() {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
//   const params = Object.assign({}, commonParams, {
//     platform: 'h5',
//     uin: 0,
//     needNewCode: 1
//   });

//   return myJsonp(url, params, options);
// };

function getDiscList() {
  const url = '/PersonalCenter/v1/Awardcode/exchangeAwardcode';
  const time = Date.now();
  console.log(time);
  const params = { _: time };

  let data = new FormData();

  data.append('awardCode', '111');
  data.append('arr', [1, 2]);
  data.append('obj', { name: 'gsp' });

  // const params = {};

  // return myAxios.get(url, {
  //   params: params
  // })
  // .then((res) => {
  //   return Promise.resolve(res.data);
  // });

  return new Promise((resolve, reject) => {
    myAxios({
      method: 'post',
      url: url,
      data: data,
      params: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      resolve(res.data);
    })
      .catch(err => reject(err));
  });
};

export { getDiscList };
