import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute } from './routes'
import { setupRouterGuard } from './routes-guards.js'; // 引入路由守卫

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoute
})

setupRouterGuard(router);
export default router
