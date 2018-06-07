import Vue from 'vue';
import Router from 'vue-router';
import GoodsComponent from '@VBusiness/goods';
import TalkComponent from '@VBusiness/talk';
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '',
      redirect: '/goods'
    },
    {
      path: '/talk',
      component: TalkComponent
    },
    {
      path: '/goods',
      component: GoodsComponent
    }
  ]
});

export default router;
