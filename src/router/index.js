import { createWebHistory, createRouter } from 'vue-router'

import DashboardView from '../pages/Dashboard.vue'
import AuthView from '../pages/Auth.vue'
import { supabase } from '../supabase'

const routes = [
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/auth', component: AuthView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  
const { data: { user } } = await supabase.auth.getUser()


  if (to.meta.requiresAuth && !user) {
    next('/auth');
  } else {
    next();
  }
});
export default router