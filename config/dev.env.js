'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// 注意下面的写法是单引号套双引号
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:'"/api/"', // API_HOST这个不要修改
  TARGET:'"http://localhost:8888"' // TARGET可以指向测试服务器，或者某位后端同事的服务地址，但需要他们设置跨域（不设置也可），但是，如果生产环境是跨域部署的话，prod.env.js里面的生产环境的API_HOST服务器，一定要设置允许跨域
})

// 通过上述的设置，在开发环境的时候，myAxios会自动将所有的前端请求，加上/api前缀，然后proxy代理，会检查请求，发现请求带/api前缀，就会将这个请求，转向dev.env.js文件中的，TARGET地址，但是TARGET地址接收到的请求，是没/api前缀的，因为proxy转发的时候，自动将/api前缀去掉了

// 因此，前端的某个接口如user，前端写user即可， TARGET服务端收到的请求地址也是user，双方均不用带/api前缀

// 在生产环境，所有前端的请求，会转向prod.env.js里面的API_HOST地址，如前端localhost:8080/user请求，会转向https://cgsp608.com:3000/user，因此需要https://cgsp608.com:3000/设置一下允许跨域


// 通过上述设置，就保证了，前端的接口地址，在开发环境和生产环境，是一致的，如上述user接口，前端均写user即可
