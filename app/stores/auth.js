import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()
    const router = useRouter()

    const user = ref(null)
    const token = ref(null)
    const loading = ref(false)
    const errors = ref([])
    const successMessage = ref('')
    const authChecked = ref(false)

    const isLoggedIn = computed(() => !!token.value)

    const register = async (formData) => {
        loading.value = true
        errors.value = []
        successMessage.value = ''

        try {
            const response = await $fetch('/auth/register', {
                method: 'POST',
                baseURL: config.public.apiBaseUrl,
                body: formData
            })

            if (response.success) {
                token.value = response.data.token
                user.value = response.data.user
                localStorage.setItem('auth_token', response.data.token)

                successMessage.value = 'Registrasi berhasil! Redirecting...'

                setTimeout(() => {
                    successMessage.value = ''
                    router.push('/')
                }, 1000)
            }

            return response
        } catch (e) {
            if (e.data && e.data.errors) {
                errors.value = e.data.errors.map(err => err.message)
            } else if (e.data && e.data.message) {
                errors.value = [e.data.message]
            } else {
                errors.value = ['Terjadi kesalahan saat mendaftar']
            }
            throw e
        } finally {
            loading.value = false
        }
    }

    const login = async (formData) => {
        loading.value = true
        errors.value = []
        successMessage.value = ''

        try {
            const response = await $fetch('/auth/login', {
                method: 'POST',
                baseURL: config.public.apiBaseUrl,
                body: formData
            })

            if (response.success) {
                token.value = response.data.token
                user.value = response.data.user
                localStorage.setItem('auth_token', response.data.token)

                successMessage.value = 'Login berhasil!'

                setTimeout(() => {
                    successMessage.value = ''
                    router.push('/')
                }, 1000)
            }

            return response
        } catch (e) {
            if (e.data && e.data.errors) {
                errors.value = e.data.errors.map(err => err.message)
            } else if (e.data && e.data.message) {
                errors.value = [e.data.message]
            } else {
                errors.value = ['Terjadi kesalahan saat login']
            }
            throw e
        } finally {
            loading.value = false
        }
    }

    const fetchProfile = async () => {
        if (!token.value) return

        try {
            const response = await $fetch('/auth/profile', {
                method: 'GET',
                baseURL: config.public.apiBaseUrl,
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            if (response.success) {
                user.value = response.data.user
            }

            return response
        } catch (e) {
            // Token invalid, logout
            logout()
            throw e
        }
    }

    const checkAuth = async () => {
        const savedToken = localStorage.getItem('auth_token')

        if (savedToken) {
            token.value = savedToken
            try {
                await fetchProfile()
            } catch (e) {
                // Token invalid
            }
        }

        authChecked.value = true
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('auth_token')
        router.push('/auth/login')
    }

    const clearErrors = () => {
        errors.value = []
    }

    const clearSuccess = () => {
        successMessage.value = ''
    }

    return {
        user,
        token,
        loading,
        errors,
        successMessage,
        isLoggedIn,
        register,
        login,
        logout,
        fetchProfile,
        checkAuth,
        clearErrors,
        clearSuccess,
        authChecked,
    }
})