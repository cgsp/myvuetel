import Vue from 'vue';
import Router from 'vue-router';
// import Rank from '@VBusiness/rank';
// import RankDetail from '@VBusiness/rank-detail';
// import Recommend from '@VBusiness/recommend';
// import RecommendDetail from '@VBusiness/recommend-detail';
// import Singer from '@VBusiness/singer';
// import Search from '@VBusiness/search';
// import SingerDetail from '@VBusiness/singer-detail';
// import UserCenter from '@VBusiness/user-center';

const Rank = ((resolve) => {
  import('@VBusiness/rank').then((moudle) => {
    resolve(moudle);
  });
});

const RankDetail = ((resolve) => {
  import('@VBusiness/rank-detail').then((moudle) => {
    resolve(moudle);
  });
});

const Recommend = ((resolve) => {
  import('@VBusiness/recommend').then((moudle) => {
    resolve(moudle);
  });
});

const RecommendDetail = ((resolve) => {
  import('@VBusiness/recommend-detail').then((moudle) => {
    resolve(moudle);
  });
});

const Singer = ((resolve) => {
  import('@VBusiness/singer').then((moudle) => {
    resolve(moudle);
  });
});

const Search = ((resolve) => {
  import('@VBusiness/search').then((moudle) => {
    resolve(moudle);
  });
});

const SingerDetail = ((resolve) => {
  import('@VBusiness/singer-detail').then((moudle) => {
    resolve(moudle);
  });
});

const UserCenter = ((resolve) => {
  import('@VBusiness/user-center').then((userCenter) => {
    resolve(userCenter);
  });
});





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
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
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
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
});

export default router;
