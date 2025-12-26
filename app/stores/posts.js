import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const usePostsStore = defineStore('posts', {
    state: () => ({
        posts: [],
        currentPost: null,
        pagination: null,
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchPosts(page = 1, limit = 4) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const response = await $fetch(`/posts?page=${page}&limit=${limit}`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'GET'
                })

                if (response.success) {
                    this.posts = response.data.posts
                    this.pagination = response.data.pagination
                    return response.data
                }
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async createPost(postData) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                if (!authStore.token) {
                    throw new Error('Tidak ada token. Silakan login terlebih dahulu.')
                }

                const response = await $fetch('/posts', {
                    baseURL: config.public.apiBaseUrl,
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: postData
                })

                if (response.success) {
                    this.posts.unshift(response.data.post)
                    return response.data.post
                }
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        }
    }
})