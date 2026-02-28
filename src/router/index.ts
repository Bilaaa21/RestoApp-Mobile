import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import Login from '../views/login.vue'
import DashboardUser from '../views/DashboardUser.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/guest/welcome'
  },
  {
    path: '/guest/welcome',
    name: 'GuestWelcome',
    component: () => import('../views/guest/Welcome.vue')
  },
  {
    path: '/guest/menu',
    name: 'GuestMenu',
    component: () => import('../views/guest/Menu.vue')
  },
  {
    path: '/guest/cart',
    name: 'GuestCart',
    component: () => import('../views/guest/Cart.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/owner/dashboard',
    name: 'OwnerDashboard',
    component: () => import('../views/owner/Dashboard.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardUser
  },
  // ─── Kasir ───────────────────────────────────────────
  {
    path: '/kasir/dashboard',
    name: 'KasirDashboard',
    component: () => import('../views/kasir/Dashboard.vue')
  },
  {
    path: '/kasir/orders/:id',
    name: 'KasirOrderDetail',
    component: () => import('../views/kasir/OrderDetail.vue')
  },

   // ─── Chef ────────────────────────────────────────────
  {
    path: '/chef/dashboard',
    name: 'ChefDashboard',
    component: () => import('../views/chef/Dashboard.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
