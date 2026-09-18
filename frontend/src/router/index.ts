import {
    createRouter,
    createWebHistory
} from 'vue-router'


import AuthLayout from '../layouts/AuthLayout.vue'

import DashboardLayout from '../layouts/DashboardLayout.vue'

import { authGuard } from './guards'

const router = createRouter({

    history:createWebHistory(),


    routes:[


        {
            path:'/',

            component:AuthLayout,

            children:[

                {
                    path:'',
                    redirect:'/login'
                },


                {
                    path:'login',

                    component:
                    () => import(
                        '../views/auth/LoginView.vue'
                    )

                }

            ]

        },


        {
            path:'dashboard',
            component:DashboardLayout,
            beforeEnter:authGuard,
            children:[
                {
                    path:'',
                    component:
                    () => import(
                        '../views/dashboard/DashboardView.vue'
                    )
                }
            ]
        }


    ]

})


export default router