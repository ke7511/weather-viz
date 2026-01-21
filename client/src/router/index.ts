import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/detail/:day',
      name: 'DailyDetail',
      component: () => import('@/views/DailyDetail.vue'),
      props: (route) => ({ day: Number(route.params.day) })
    }
  ]
})

export default router
