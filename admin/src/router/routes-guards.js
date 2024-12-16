import message from "@/utils/message.js";

export function setupRouterGuard(router) {


    // 全局前置守卫
    router.beforeEach(async (to, from, next) => {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token

        // 延迟加载 useAdminStore
        const { useAdminStore } = await import("@/store/admin/index.js");
        const adminStore = useAdminStore();

        if(to.path === '/login') {
           return  next(); // 跳转到登录页，不进行任何操作
        }


            // 如果没有 Token 或未登录
            if (!token) {
                message.warning("未登录，请先登录");
                next('/login'); // 跳转到登录页
            } else {
                // 如果有 Token，但未加载用户信息，则尝试获取用户信息
                if (!adminStore.adminId) {
                    try {
                        await adminStore.fetchAdminInfo();
                        next(); // 成功获取信息后继续导航
                    } catch (error) {
                        message.error("获取用户信息失败，请重新登录");
                        next('/login');
                    }
                } else {
                    next(); // 已加载用户信息，直接导航
                }
            }

    });

    // 全局后置守卫
    router.afterEach((to, from) => {

    });
}
