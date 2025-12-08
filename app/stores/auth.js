import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.user
    },

    actions: {
        async register(data) {
            const config = useRuntimeConfig()
            this.loading = true
            this.error = null

            try {
                const response = await $fetch(`${config.public.apiBaseUrl}/auth/register`, {
                    method: 'POST',
                    body: data
                })

                this.token = response.data.token
                this.user = response.data.user

                if (process.client) {
                    localStorage.setItem('auth_token', response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                }

                return {
                    success: true,
                    data: response.data,
                    message: response.message
                }
            } catch (err) {
                console.error('Register error:', err)

                // Handle error response sesuai struktur API
                const errorData = err.data || {}
                this.error = errorData.message || 'Registration failed'

                return {
                    success: false,
                    message: errorData.message,
                    errors: errorData.errors // Array of { field, message }
                }
            } finally {
                this.loading = false
            }
        },

        async login(data) {
            const config = useRuntimeConfig()
            this.loading = true
            this.error = null

            try {
                const response = await $fetch(`${config.public.apiBaseUrl}/auth/login`, {
                    method: 'POST',
                    body: data
                })

                this.token = response.data.token
                this.user = response.data.user

                if (process.client) {
                    localStorage.setItem('auth_token', response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                }

                return {
                    success: true,
                    data: response.data,
                    message: response.message
                }
            } catch (err) {
                console.error('Login error:', err)

                const errorData = err.data || {}
                this.error = errorData.message || 'Login failed'

                return {
                    success: false,
                    message: errorData.message,
                    errors: errorData.errors
                }
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
            this.error = null

            if (process.client) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user')
            }
        },

        initAuth() {
            if (process.client) {
                const token = localStorage.getItem('auth_token')
                const user = localStorage.getItem('user')

                if (token && user) {
                    this.token = token
                    this.user = JSON.parse(user)
                }
            }
        }
    }
})