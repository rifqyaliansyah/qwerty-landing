import { defineStore } from 'pinia'

export const useViewsStore = defineStore('views', {
    state: () => ({
        stats: null,
        isLoading: false,
        error: null,
        lastTrackedUrl: null,
        sessionId: null
    }),

    actions: {
        /**
         * Initialize session ID
         */
        initSession() {
            if (process.client) {
                // Check if session exists in sessionStorage
                let sessionId = sessionStorage.getItem('analytics_session')

                if (!sessionId) {
                    // Generate new session ID
                    sessionId = this.generateSessionId()
                    sessionStorage.setItem('analytics_session', sessionId)
                }

                this.sessionId = sessionId
            }
        },

        /**
         * Generate random session ID
         */
        generateSessionId() {
            return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
        },

        /**
         * Track page view
         * @param {string} url - URL path yang dikunjungi
         */
        async trackView(url) {
            // Avoid duplicate tracking untuk URL yang sama
            if (this.lastTrackedUrl === url) {
                return
            }

            // Initialize session if not exists
            if (!this.sessionId) {
                this.initSession()
            }

            try {
                const config = useRuntimeConfig()
                const apiUrl = config.public.apiBaseUrl

                const response = await fetch(`${apiUrl}/view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url,
                        sessionId: this.sessionId
                    })
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
            }
        },

        /**
         * Get stats dengan options
         */
        async fetchStats(options = {}) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const apiUrl = config.public.apiBaseUrl

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
         * Get total views & unique visitors
         */
        async getTotalViews() {
            return await this.fetchStats({ type: 'total' })
        },

        /**
         * Get today's stats
         */
        async getTodayStats() {
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
         * Get comprehensive stats
         */
        async getComprehensiveStats() {
            return await this.fetchStats({ type: 'comprehensive' })
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
                unique: state.stats.unique_visitors || 0,
                today: state.stats.today_stats || {},
                topPages: state.stats.top_pages || [],
                weeklyTrend: state.stats.weekly_trend || []
            }
        }
    }
})