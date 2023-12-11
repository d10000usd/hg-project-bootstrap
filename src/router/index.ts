import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/NaviJsonView.vue')
    }
    ,
   
    // 블로그네비게이션
    {
      path: '/NaviJsonView',
      name: 'NaviJsonView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/NaviJsonView.vue'),
      // props: (route) => ({ apisend: route.query.apisend }), // 라우터를 통해 receivedRouteName 전달
    }    ,
   
    // 블로그네비게이션
    {
      path: '/TsWebsocket_main',
      name: 'TsWebsocket_main',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TsWebsocket_main.vue'),
      props: route => ({ message: route.query.message ? JSON.parse(route.query.message as string) : null }),
    }
    ,
    // 블로그네비게이션
    {
      path: '/TsWebsocket_all_orderingView',
      name: 'TsWebsocket_all_orderingView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TsWebsocket_all_orderingView.vue'),
      // props: (route) => ({ apisend: route.query.apisend }), // 라우터를 통해 receivedRouteName 전달
    }
    ,
    // 블로그네비게이션
    {
      path: '/TsWebsocket_allView',
      name: 'TsWebsocket_allView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TsWebsocket_allView.vue'),
      // props: (route) => ({ apisend: route.query.apisend }), // 라우터를 통해 receivedRouteName 전달
    }
    ,
    // 블로그네비게이션
    {
      path: '/TsWebsocket_holdView',
      name: 'TsWebsocket_holdView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TsWebsocket_holdView.vue'),
      // props: (route) => ({ apisend: route.query.apisend }), // 라우터를 통해 receivedRouteName 전달
    },
      // 블로그네비게이션
      {
        path: '/TsWebsocket_watchView',
        name: 'TsWebsocket_watchView',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/TsWebsocket_watchView.vue'),
        // props: (route) => ({ apisend: route.query.apisend }), // 라우터를 통해 receivedRouteName 전달
      },
  
    // 블로그네비게이션
    {
      path: '/TelegramView',
      name: 'TelegramView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TelegramView.vue'),
      // props: (route) => ({ apisend: route.query.apisend }), // 라우터를 통해 receivedRouteName 전달
    },
    {
      path: '/TsWebsocket_Report',
      name: 'TsWebsocket_Report',
      component: () => import('../components/TsWebsocket_Report.vue'),
      props: route => ({ message: route.query.message ? JSON.parse(route.query.message as string) : null }),
      // Explicitly cast the query parameter to a string ^
    },
    {
      path: '/RealTimeChartView',
      name: 'RealTimeChartView',
      component: () => import('../views/RealTimeChartView.vue'),

      // Explicitly cast the query parameter to a string ^
    },
    {
      path: '/WebSearchView',
      name: 'WebSearchView',
      component: () => import('../views/WebSearchView.vue'),

      // Explicitly cast the query parameter to a string ^
    },
  ]
})



export default router
