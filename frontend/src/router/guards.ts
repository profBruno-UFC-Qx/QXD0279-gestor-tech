import type {
    NavigationGuardNext,
    RouteLocationNormalized
} from 'vue-router'


export function authGuard(
    to:RouteLocationNormalized,
    from:RouteLocationNormalized,
    next:NavigationGuardNext
){

    const token =
        localStorage.getItem('token')


    if(!token){

        next('/login')

        return
    }


    next()

}