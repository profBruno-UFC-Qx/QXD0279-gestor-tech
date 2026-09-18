import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({

    history: createWebHistory(),

    routes: [

        {
            path: '/',
            redirect: '/login'
        },

        {
            path: '/login',
            component: () => import('../views/auth/LoginView.vue')
        },

        {
            path: '/dashboard',
            component: () => import('../views/dashboard/DashboardView.vue')
        }

    ]

})


export default router