//常量路由
export const constantRoute = [

    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/login/index.vue'),
    },

    //数据大屏
    {
        path: '/datashow',  // 数据展示路由
        name: 'DataShow',
        component: () => import('@/pages/dataShow/index.vue'),  // 假设你有 user 组件
    },


    /* 首页 */
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/pages/layout/index.vue'),
        redirect: '/home',
        children: [

            //首页
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/pages/layout/home/index.vue'),
                meta: { requiresAuth: true, title: '首页' },
            },


            // 用户账号管理
            {
                path: 'jobSeekerAccount',
                name: 'JobSeekerAccount',
                component: () => import('@/pages/layout/jobSeeker/account/index.vue'),  // 假设你有 datashow 组件
            },
            //简历管理
            {
                path: 'resume',
                name: 'Resume',
                component: () => import('@/pages/layout/jobSeeker/resume/index.vue'),  // 假设你有 datashow 组件
            },


            // 招聘者管理
            {
                path: 'companyAccount',
                name: 'CompanyAccount',
                component: () => import('@/pages/layout/company/account/index.vue'),
            },
            //职位管理
            {
                path: 'position',
                name: 'Position',
                component: () => import('@/pages/layout/company/position/index.vue'),
            },


            //其他管理
            {
                path: 'companyCarousels',
                name: 'CompanyCarousels',
                component: () => import('@/pages/layout/other/CompanyCarousels/index.vue'),
            },
            {
                path: 'jobSeekerCarousels',
                name: 'JobSeekerCarousels',
                component: () => import('@/pages/layout/other/JobseekerCarousels/index.vue'),
            },
            {
                path: 'interViewInfo',
                name: 'InterViewInfo',
                component: () => import('@/pages/layout/other/InterViewInfo/index.vue'),
            },
            {
                path: 'webInfo',
                name: 'WebInfo',
                component: () => import('@/pages/layout/other/WebInfo/index.vue'),
            },


            //管理信息
            {
                path: 'adminInfo',
                name: 'AdminInfo',
                component: () => import('@/pages/layout/adminInfo/index.vue'),
            },

            //留言信箱
            {
                path: 'message',
                name: 'Message',
                component: () => import('@/pages/layout/message/index.vue')
            }






        ],
    },


    // 404 页面路由
    {
        path: '/:catchAll(.*)',  // 捕获所有未匹配的路径
        name: 'NotFound',
        component: () => import('@/pages/404/index.vue'),
    },
    ]
