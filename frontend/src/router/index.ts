import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { authGuard } from './guards'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AuthLayout,
            children: [
                {
                    path: '',
                    redirect: { name: 'login' },
                },
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/auth/LoginView.vue'),
                },
            ],
        },
        {
            path: '/dashboard',
            component: DashboardLayout,
            beforeEnter: authGuard,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/dashboard/DashboardView.vue'),
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
        },
    ],
})

export default router
