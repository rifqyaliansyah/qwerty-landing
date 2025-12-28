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

    // Load dari localStorage saat store di-init
    const loadFromStorage = () => {
        if (import.meta.client) {
            const savedToken = localStorage.getItem('auth_token')
            const savedUser = localStorage.getItem('auth_user')

            if (savedToken) {
                token.value = savedToken
            }

            if (savedUser) {
                try {
                    user.value = JSON.parse(savedUser)
                } catch (e) {
                    console.error('Failed to parse user data:', e)
                    localStorage.removeItem('auth_user')
                }
            }
        }
    }

    // Save ke localStorage
    const saveToStorage = () => {
        if (import.meta.client) {
            if (token.value) {
                localStorage.setItem('auth_token', token.value)
            }
            if (user.value) {
                localStorage.setItem('auth_user', JSON.stringify(user.value))
            }
        }
    }

    // Clear localStorage
    const clearStorage = () => {
        if (import.meta.client) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
    }

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
                saveToStorage()

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
                saveToStorage()

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
                saveToStorage()
            }

            return response
        } catch (e) {
            logout()
            throw e
        }
    }

    const updateProfile = async (formData) => {
        loading.value = true
        errors.value = []
        successMessage.value = ''

        try {
            const response = await $fetch('/auth/profile', {
                method: 'PUT',
                baseURL: config.public.apiBaseUrl,
                headers: {
                    'Authorization': `Bearer ${token.value}`
                },
                body: formData
            })

            if (response.success) {
                user.value = response.data.user
                saveToStorage()
                successMessage.value = response.message || 'Profile berhasil diupdate!'

                setTimeout(() => {
                    successMessage.value = ''
                }, 3000)
            }

            return response
        } catch (e) {
            if (e.data && e.data.errors) {
                errors.value = e.data.errors.map(err => err.message)
            } else if (e.data && e.data.message) {
                errors.value = [e.data.message]
            } else {
                errors.value = ['Terjadi kesalahan saat update profile']
            }
            throw e
        } finally {
            loading.value = false
        }
    }

    // const updatePassword = async (formData) => {
    //     loading.value = true
    //     errors.value = []
    //     successMessage.value = ''

    //     try {
    //         const response = await $fetch('/auth/password', {
    //             method: 'PUT',
    //             baseURL: config.public.apiBaseUrl,
    //             headers: {
    //                 'Authorization': `Bearer ${token.value}`
    //             },
    //             body: formData
    //         })

    //         if (response.success) {
    //             successMessage.value = 'Password berhasil diubah!'

    //             setTimeout(() => {
    //                 successMessage.value = ''
    //             }, 3000)
    //         }

    //         return response
    //     } catch (e) {
    //         if (e.data && e.data.errors) {
    //             errors.value = e.data.errors.map(err => err.message)
    //         } else if (e.data && e.data.message) {
    //             errors.value = [e.data.message]
    //         } else {
    //             errors.value = ['Terjadi kesalahan saat update password']
    //         }
    //         throw e
    //     } finally {
    //         loading.value = false
    //     }
    // }

    const uploadAvatar = async (file) => {
        loading.value = true
        errors.value = []
        successMessage.value = ''

        try {
            const formData = new FormData()
            formData.append('avatar', file)

            const response = await $fetch('/auth/avatar', {
                method: 'POST',
                baseURL: config.public.apiBaseUrl,
                headers: {
                    'Authorization': `Bearer ${token.value}`
                },
                body: formData
            })

            if (response.success) {
                user.value = response.data.user
                saveToStorage()
                successMessage.value = 'Avatar berhasil diupload!'

                setTimeout(() => {
                    successMessage.value = ''
                }, 3000)
            }

            return response
        } catch (e) {
            if (e.data && e.data.errors) {
                errors.value = e.data.errors.map(err => err.message)
            } else if (e.data && e.data.message) {
                errors.value = [e.data.message]
            } else {
                errors.value = ['Terjadi kesalahan saat upload avatar']
            }
            throw e
        } finally {
            loading.value = false
        }
    }

    const checkAuth = async () => {
        loadFromStorage()

        if (token.value) {
            try {
                await fetchProfile()
            } catch (e) {
                console.error('Auth check failed:', e)
            }
        }

        authChecked.value = true
    }

    const logout = () => {
        user.value = null
        token.value = null
        clearStorage()
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
        authChecked,
        isLoggedIn,
        register,
        login,
        logout,
        fetchProfile,
        updateProfile,
        updatePassword,
        uploadAvatar,
        checkAuth,
        clearErrors,
        clearSuccess
    }
})