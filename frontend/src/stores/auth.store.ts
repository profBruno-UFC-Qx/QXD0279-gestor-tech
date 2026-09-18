import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User } from '../types/Auth'
import * as authService from '../services/auth.service'

export const useAuthStore = defineStore(
    'auth',
    () => {

        const user = ref<User | null>(null)

        const token = ref<string | null>(
            localStorage.getItem('token')
        )


        async function login(
            email:string,
            password:string
        ){

            const response =
                await authService.login({
                    email,
                    password
                })

            token.value =
                response.token

            user.value =
                response.user


            localStorage.setItem(
                'token',
                response.token
            )
        }


        function logout(){

            user.value = null

            token.value = null

            localStorage.removeItem(
                'token'
            )

        }


        return {
            user,
            token,
            login,
            logout
        }

    }
)