// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 兼容处理
import 'babel-polyfill';
// 兼容处理
if (Number.parseInt === undefined) Number.parseInt = window.parseInt;
if (Number.parseFloat === undefined) Number.parseFloat = window.parseFloat;
import fastclick from 'fastclick';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

import '@scss/index.scss';

import 'jquery';

import VueLazyLoad from 'vue-lazyload';

Vue.config.productionTip = false;

fastclick.attach(document.body);

// document.addEventListener('touchmove', function (event) {
//   event.preventDefault();
//   // handle move
// }, false);111


Vue.use(VueLazyLoad, {
  loading: require('@imgs/lazy.png'),
  preLoad: 1.3,
  attempt: 1
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
