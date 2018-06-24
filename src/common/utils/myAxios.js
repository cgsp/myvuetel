import axios from 'axios';
// const DEV = process.env.NODE_ENV !== 'production';
const API = process.env.API_HOST;
// 配置代理
// 第一种写法
// 生产环境，需要服务端（https://cgsp608.com:3000）设置一下允许跨域
// DEV ? axios.defaults.baseURL = '/api' : axios.defaults.baseURL = 'https://cgsp608.com:3000';
// 第二种写法
axios.defaults.baseURL = API;

// token设置
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN_gsp';
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
