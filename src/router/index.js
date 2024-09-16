import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutContainer from '@/views/LayoutContainer.vue'
// import HomeView from '@/views/HomeView.vue'
import BusSearch from '@/views/BusSearch.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutContainer,
      redirect: '/bus-search',
      children: [
        {
          path: '/bus-search',
          component: BusSearch
        }
      ]
    }
  ]
})

export default router
