<script setup>
import { onMounted } from 'vue'
import { PhEye } from '@phosphor-icons/vue'
import { usePostsStore } from '~/stores/posts'

const postsStore = usePostsStore()

const getAuthorName = (post) => {
    if (post.is_anonymous) return 'Someone'
    return post.author?.username
}

const getAuthorAvatar = (post) => {
    if (post.is_anonymous) return '/images/default.jpg'
    return post.author?.avatar_url
}

const getStyling = (post) => {
    const styling = post.styling || {}
    return {
        backgroundColor: styling.background_color,
        borderWidth: styling.border_width,
        borderStyle: styling.border_style,
        borderColor: styling.border_color
    }
}

onMounted(async () => {
    await postsStore.fetchPosts(1, 4)
})
</script>

<template>
    <div class="container">
        <h3 class="padding-top-medium margin-bottom-none">Explore lebih banyak kata-kata</h3>
        <p class="padding-top-none margin-top-none">Masih banyak kata lain yang bisa kamu temukan di sini.</p>

        <div v-if="postsStore.isLoading" class="text-center padding-large">
            <p>Loading...</p>
        </div>

        <div v-else class="row">
            <div v-for="post in postsStore.posts" :key="post.id" class="sm-12 md-6">
                <div
                    class="card margin-right-small margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div :class="[
                        'card-body',
                        'shadow-hover',
                        'shadow',
                        'border',
                        getStyling(post).backgroundColor,
                        getStyling(post).borderWidth,
                        getStyling(post).borderStyle,
                        getStyling(post).borderColor
                    ]">
                        <h4 class="card-title">{{ post.title }}</h4>
                        <div class="card-author">
                            <img :src="getAuthorAvatar(post)" :alt="getAuthorName(post)" class="author-avatar">
                            <h5 class="card-subtitle">{{ getAuthorName(post) }}</h5>
                        </div>
                        <p class="card-text">{{ post.content }}</p>
                        <div class="card-footer-inline">
                            <NuxtLink class="card-link" :to="`/posts/${post.slug}`">Lihat</NuxtLink>
                            <span class="view-count">
                                <PhEye :size="16" /> {{ post.views || 0 }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!postsStore.isLoading && postsStore.posts.length > 0"
            class="row padding-top-large margin-bottom-none">
            <div class="sm-12" style="text-align: center;">
                <NuxtLink to="/posts">
                    <button>Lihat lebih banyak</button>
                </NuxtLink>
            </div>
        </div>

        <div v-if="!postsStore.isLoading && postsStore.posts.length === 0" class="text-center padding-large">
            <p>Belum ada post yang tersedia.</p>
        </div>
    </div>
</template>

<style scoped>
.card-no-border {
    border: none !important;
    box-shadow: none !important;
}

.card-body {
    padding: 1.5rem;
}

.card-author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #41403e;
    object-fit: cover;
}

.card-author .card-subtitle {
    margin: 0;
}

.card-footer-inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.view-count {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    color: #666;
}
</style>