import { useViewsStore } from '~/stores/views'

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const viewsStore = useViewsStore()

    // Routes yang di-track untuk analytics
    const trackedRoutes = [
        '/',
        '/explore',
        '/quotes',
        '/myquotes',
        '/profile'
    ]

    // Helper: Check if route should be tracked
    const shouldTrackRoute = (path) => {
        // Track exact matches
        if (trackedRoutes.includes(path)) {
            return true
        }

        // Track /quotes/[slug] (detail page)
        // Tapi skip /quotes/[slug]/edit
        if (path.startsWith('/quotes/') && !path.endsWith('/edit')) {
            return true
        }

        return false
    }

    // Initialize session saat plugin dimuat
    if (process.client) {
        viewsStore.initSession()

        // Track initial page load
        const currentPath = router.currentRoute.value.path

        if (shouldTrackRoute(currentPath)) {
            viewsStore.trackView(currentPath)
        }
    }

    // Track subsequent navigation (route changes)
    router.afterEach((to, from) => {
        // Hanya track jika route benar-benar berubah dan termasuk tracked routes
        if (to.path !== from.path && shouldTrackRoute(to.path)) {
            viewsStore.trackView(to.path)
        }
    })
})