import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()
    const router = useRouter()

    const loading = ref(false)
    const errors = ref([])
    const successMessage = ref('')

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

    const clearErrors = () => {
        errors.value = []
    }

    const clearSuccess = () => {
        successMessage.value = ''
    }

    return {
        loading,
        errors,
        successMessage,
        register,
        login,
        clearErrors,
        clearSuccess
    }
})