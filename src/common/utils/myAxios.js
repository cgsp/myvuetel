import axios from 'axios';

// const dev = process.env.NODE_ENV !== 'production';
// axios.defaults.baseURL = 'https://localhost:3000';
// axios.defaults.baseURL = '/api';
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const myAxios = axios;

export { myAxios };

// 用法
// function getDiscList() {
//   // 上面的直接获取的方式是不行的，因为这个接口只允许reffer是QQ的服务器才能请求
//   const url = 'http://ustbhuangyi.com/music/api/getDiscList';
//   const params = Object.assign({}, commonParams, {
//     platform: 'yqq',
//     hostUin: 0,
//     sin: 0,
//     ein: 29,
//     sortId: 5,
//     needNewCode: 0,
//     categoryId: 10000000,
//     rnd: Math.random(),
//     format: 'json'
//   });

//   // return jsonp(url, data, options);
//   return myAxios.get(url, {
//     header:{

//     },
//     params: params
//   })
//   .then((res) => {
//     return Promise.resolve(res.data);
//   });
// }
