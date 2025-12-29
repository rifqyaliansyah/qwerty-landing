import { useViewsStore } from '~/stores/views'

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const viewsStore = useViewsStore()

    // Track initial page load
    if (process.client) {
        // Track homepage on first load
        const currentPath = router.currentRoute.value.path

        // Hanya track homepage "/" saat pertama kali load
        if (currentPath === '/') {
            viewsStore.trackView(currentPath)
        }
    }

    // Track subsequent navigation (route changes)
    router.afterEach((to, from) => {
        // Hanya track jika route benar-benar berubah
        if (to.path !== from.path) {
            // Hanya track homepage "/"
            if (to.path === '/') {
                viewsStore.trackView(to.path)
            }
        }
    })
})