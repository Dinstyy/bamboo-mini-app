import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Companies from '../views/Companies.vue'
import ProcessStages from '../views/process_stages/ProcessStages.vue'
import ProcessStagesGroupDetail from '../views/process_stages/ProcessStagesGroupDetail.vue' 
import SalesQuotation from '../views/sales_quotation/SalesQuotation.vue'
import SalesQuotationGroupDetail from '../views/sales_quotation/SalesQuotationGroupDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
    meta: { requiresAuth: true }
  },
  {
    path: '/process-stages', 
    name: 'ProcessStages',
    component: ProcessStages,
    meta: { requiresAuth: true }
  },
  {
    path: '/process-stages/group/:id',
    name: 'ProcessStagesGroupDetail',
    component: ProcessStagesGroupDetail,
    meta: { requiresAuth: true }
  },
  { 
    path: '/sales-quotation',
    name: 'SalesQuotation',
    component: SalesQuotation,
    meta: { requiresAuth: true }
  },
  { 
    path: '/sales-quotation/group/:id',
    name: 'SalesQuotationGroupDetail',
    component: SalesQuotationGroupDetail,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router