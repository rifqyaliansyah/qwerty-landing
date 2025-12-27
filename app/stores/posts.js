import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const usePostsStore = defineStore('posts', {
    state: () => ({
        posts: [],
        myPosts: [],
        currentPost: null,
        pagination: null,
        myPostsPagination: null,
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchPosts(page = 1, limit = 4) {
            this.isLoading = page === 1
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const headers = {}
                if (authStore.token) {
                    headers['Authorization'] = `Bearer ${authStore.token}`
                    console.log('Fetching posts with token:', authStore.token.substring(0, 20) + '...') // Debug
                } else {
                    console.log('Fetching posts without token') // Debug
                }

                const response = await $fetch(`/posts?page=${page}&limit=${limit}`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'GET',
                    headers
                })

                if (response.success) {
                    console.log('Posts received:', response.data.posts) // Debug - cek is_liked_by_user
                    if (page === 1) {
                        this.posts = response.data.posts
                    } else {
                        this.posts = [...this.posts, ...response.data.posts]
                    }
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
        async fetchMyPosts(page = 1, limit = 4) {
            this.isLoading = page === 1
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                if (!authStore.token) {
                    throw new Error('Tidak ada token. Silakan login terlebih dahulu.')
                }

                const response = await $fetch(`/posts/user/me?page=${page}&limit=${limit}`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    if (page === 1) {
                        this.myPosts = response.data.posts
                    } else {
                        this.myPosts = [...this.myPosts, ...response.data.posts]
                    }
                    this.myPostsPagination = response.data.pagination
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
                    this.myPosts.unshift(response.data.post)
                    return response.data.post
                }
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchPostBySlug(slug) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const headers = {}
                if (authStore.token) {
                    headers['Authorization'] = `Bearer ${authStore.token}`
                }

                const response = await $fetch(`/posts/${slug}`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'GET',
                    headers
                })

                if (response.success) {
                    this.currentPost = response.data.post
                    return response.data.post
                }
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updatePost(slug, postData) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                if (!authStore.token) {
                    throw new Error('Tidak ada token. Silakan login terlebih dahulu.')
                }

                const response = await $fetch(`/posts/${slug}`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: postData
                })

                if (response.success) {
                    const updatedPost = response.data.post

                    // Update in posts array
                    const postIndex = this.posts.findIndex(p => p.slug === slug)
                    if (postIndex !== -1) {
                        this.posts[postIndex] = updatedPost
                    }

                    // Update in myPosts array
                    const myPostIndex = this.myPosts.findIndex(p => p.slug === slug)
                    if (myPostIndex !== -1) {
                        this.myPosts[myPostIndex] = updatedPost
                    }

                    this.currentPost = updatedPost
                    return updatedPost
                }
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async deletePost(slug) {
            this.isLoading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                if (!authStore.token) {
                    throw new Error('Tidak ada token. Silakan login terlebih dahulu.')
                }

                const response = await $fetch(`/posts/${slug}`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    // Remove from posts array
                    this.posts = this.posts.filter(post => post.slug !== slug)
                    // Remove from myPosts array
                    this.myPosts = this.myPosts.filter(post => post.slug !== slug)
                    return response
                }
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async toggleLike(slug) {
            this.error = null

            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                if (!authStore.token) {
                    throw new Error('Tidak ada token. Silakan login terlebih dahulu.')
                }

                const response = await $fetch(`/posts/${slug}/like`, {
                    baseURL: config.public.apiBaseUrl,
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response.success) {
                    const { is_liked, likes_count } = response.data

                    // Update di posts array
                    const postIndex = this.posts.findIndex(p => p.slug === slug)
                    if (postIndex !== -1) {
                        this.posts[postIndex].is_liked_by_user = is_liked
                        this.posts[postIndex].likes_count = likes_count
                    }

                    // Update di myPosts array
                    const myPostIndex = this.myPosts.findIndex(p => p.slug === slug)
                    if (myPostIndex !== -1) {
                        this.myPosts[myPostIndex].is_liked_by_user = is_liked
                        this.myPosts[myPostIndex].likes_count = likes_count
                    }

                    // Update currentPost jika ada
                    if (this.currentPost && this.currentPost.slug === slug) {
                        this.currentPost.is_liked_by_user = is_liked
                        this.currentPost.likes_count = likes_count
                    }

                    return response.data
                }
            } catch (error) {
                this.error = error.message
                throw error
            }
        }
    }
})