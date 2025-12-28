import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useQuoteStore = defineStore('quotes', {
    state: () => ({
        currentQuote: '',
        isLoading: false,
        error: null,
    }),

    actions: {
        /**
         * Initialize quote from localStorage on mount
         */
        initializeQuote() {
            if (process.client) {
                const savedQuote = localStorage.getItem('currentQuote')
                if (savedQuote) {
                    this.currentQuote = savedQuote
                }
            }
        },

        /**
         * Generate new quote from API
         */
        async generateQuote() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()
                const token = authStore.token

                if (!token) {
                    throw new Error('Kamu harus login dulu untuk generate quote')
                }

                // Get API URL from runtime config or env
                const config = useRuntimeConfig()
                const apiUrl = config.public.apiBaseUrl

                const response = await fetch(`${apiUrl}/quotes/generate`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message)
                }

                // Set quote baru
                this.currentQuote = data.data.quote

                // Save to localStorage
                if (process.client) {
                    localStorage.setItem('currentQuote', data.data.quote)
                }

                return data.data.quote

            } catch (err) {
                console.error('Error generating quote:', err)
                this.error = err.message
                throw err
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Reset quote (dipanggil saat logout)
         */
        resetQuote() {
            this.currentQuote = ''
            this.error = null

            // Clear from localStorage
            if (process.client) {
                localStorage.removeItem('currentQuote')
            }
        }
    }
})