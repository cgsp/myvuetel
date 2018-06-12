import Vue from 'vue';
import Router from 'vue-router';
import Rank from '@VBusiness/rank';
import Recommend from '@VBusiness/recommend';
import Singer from '@VBusiness/singer';
import Search from '@VBusiness/search';
import SingerDetail from '@VBusiness/singer-detail';
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/recommend',
      component: Recommend
    }
  ]
});

export default router;
