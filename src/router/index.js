import Vue from 'vue';
import Router from 'vue-router';
import Rank from '@VBusiness/rank';
import RankDetail from '@VBusiness/rank-detail';
import Recommend from '@VBusiness/recommend';
import RecommendDetail from '@VBusiness/recommend-detail';
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
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
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
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendDetail
        }
      ]
    }
  ]
});

export default router;
