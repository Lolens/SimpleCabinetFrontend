import { createRouter, createWebHistory } from 'vue-router'
import CabinetView from '../views/CabinetView.vue'
import HomeView from '../views/HomeView.vue'
import users from './users'
import auth from './auth'
import debug from './debug'
import security from './security'
import shop from './shop'
import admin from './admin'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cabinet',
      name: 'cabinet',
      component: CabinetView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    ...users,
    ...auth,
    ...debug,
    ...security,
    ...shop,
    ...admin,
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/HomeView.vue'),
    },
  ],
})

export default router
