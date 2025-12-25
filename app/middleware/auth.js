export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (authStore.authChecked && !authStore.isLoggedIn) {
        return navigateTo('/auth/login', { replace: true })
    }
})