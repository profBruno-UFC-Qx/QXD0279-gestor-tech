import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { authGuard } from './guards'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => ({ top: 0 }),
    routes: [
        {
            path: '/login',
            component: AuthLayout,
            children: [
                {
                    path: '',
                    name: 'login',
                    component: () => import('@/views/auth/LoginView.vue'),
                },
            ],
        },
        {
            path: '/cadastro',
            component: AuthLayout,
            children: [
                {
                    path: '',
                    name: 'register',
                    component: () => import('@/views/auth/RegisterView.vue'),
                },
            ],
        },
        {
            path: '/',
            component: AppLayout,
            beforeEnter: authGuard,
            children: [
                { path: '', redirect: { name: 'dashboard' } },
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    meta: {
                        title: 'Dashboard',
                        breadcrumbs: ['Gestor Tech', 'Dashboard'],
                    },
                    component: () => import('@/views/dashboard/DashboardView.vue'),
                },
                {
                    path: 'projetos',
                    name: 'projects',
                    meta: { title: 'Projetos', breadcrumbs: ['Gestor Tech', 'Projetos'] },
                    component: () => import('@/views/projects/ProjectsView.vue'),
                },
                {
                    path: 'projetos/novo',
                    name: 'project-create',
                    meta: { title: 'Novo projeto', breadcrumbs: ['Projetos', 'Novo projeto'] },
                    component: () => import('@/views/projects/ProjectFormView.vue'),
                },
                {
                    path: 'projetos/:projectId',
                    name: 'project-overview',
                    meta: { title: 'Visão geral do projeto', breadcrumbs: ['Projetos', 'Visão geral'] },
                    component: () => import('@/views/projects/ProjectOverviewView.vue'),
                },
                {
                    path: 'projetos/:projectId/editar',
                    name: 'project-edit',
                    meta: { title: 'Editar projeto', breadcrumbs: ['Projetos', 'Editar projeto'] },
                    component: () => import('@/views/projects/ProjectFormView.vue'),
                },
                {
                    path: 'projetos/:projectId/equipe',
                    name: 'project-team',
                    meta: { title: 'Equipe do projeto', breadcrumbs: ['Projetos', 'Equipe'] },
                    component: () => import('@/views/projects/ProjectTeamView.vue'),
                },
                {
                    path: 'projetos/:projectId/atividades',
                    name: 'project-activities',
                    meta: { title: 'Atividades do projeto', breadcrumbs: ['Projetos', 'Atividades'] },
                    component: () => import('@/views/projects/ProjectActivitiesView.vue'),
                },
                {
                    path: 'minhas-atividades',
                    name: 'my-activities',
                    meta: { title: 'Minhas atividades', breadcrumbs: ['Gestor Tech', 'Minhas atividades'] },
                    component: () => import('@/views/activities/MyActivitiesView.vue'),
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
