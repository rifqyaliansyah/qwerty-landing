import { defineStore } from 'pinia'

export const useViewsStore = defineStore('views', {
    state: () => ({
        stats: null,
        isLoading: false,
        error: null,
        lastTrackedUrl: null
    }),

    actions: {
        /**
         * Track page view
         * @param {string} url - URL path yang dikunjungi
         */
        async trackView(url) {
            // Avoid duplicate tracking untuk URL yang sama
            if (this.lastTrackedUrl === url) {
                return
            }

            try {
                const config = useRuntimeConfig()
                const apiUrl = config.public.apiBaseUrl

                const response = await fetch(`${apiUrl}/view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to track view')
                }

                this.lastTrackedUrl = url
                return data

            } catch (err) {
                console.error('Error tracking view:', err)
                this.error = err.message
                // Don't throw error, just log it (tracking shouldn't break the app)
            }
        },

        /**
         * Get comprehensive stats (untuk Discord)
         */
        async fetchStats(options = {}) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const apiUrl = config.public.apiBaseUrl

                // Build query params
                const params = new URLSearchParams()
                if (options.type) params.append('type', options.type)
                if (options.period) params.append('period', options.period)
                if (options.limit) params.append('limit', options.limit)

                const queryString = params.toString()
                const url = `${apiUrl}/stats${queryString ? '?' + queryString : ''}`

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch stats')
                }

                this.stats = data.data
                return data.data

            } catch (err) {
                console.error('Error fetching stats:', err)
                this.error = err.message
                throw err
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Get total views only
         */
        async getTotalViews() {
            return await this.fetchStats({ type: 'total' })
        },

        /**
         * Get today's views
         */
        async getTodayViews() {
            return await this.fetchStats({ type: 'today' })
        },

        /**
         * Get top pages
         */
        async getTopPages(limit = 10) {
            return await this.fetchStats({ type: 'top', limit })
        },

        /**
         * Get views by period
         */
        async getViewsByPeriod(days = 7) {
            return await this.fetchStats({ type: 'period', period: days })
        },

        /**
         * Reset stats
         */
        resetStats() {
            this.stats = null
            this.error = null
            this.lastTrackedUrl = null
        }
    },

    getters: {
        /**
         * Get formatted stats untuk display
         */
        formattedStats: (state) => {
            if (!state.stats) return null

            return {
                total: state.stats.total_views || 0,
                today: state.stats.today_views || 0,
                topPages: state.stats.top_pages || [],
                weeklyTrend: state.stats.weekly_trend || []
            }
        }
    }
})