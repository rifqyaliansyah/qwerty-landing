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

        <!-- Skeleton Loading -->
        <div v-if="postsStore.isLoading" class="row">
            <div v-for="i in 4" :key="`skeleton-${i}`" class="col-12 sm-12 md-6">
                <div
                    class="card margin-right-small margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body shadow border">
                        <div class="skeleton skeleton-title"></div>
                        <div class="card-author">
                            <div class="skeleton skeleton-avatar"></div>
                            <div class="skeleton skeleton-subtitle"></div>
                        </div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text skeleton-text-short"></div>
                        <div class="card-footer-inline">
                            <div class="skeleton skeleton-link"></div>
                            <div class="skeleton skeleton-views"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actual Posts -->
        <div v-else class="row">
            <div v-for="post in postsStore.posts" :key="post.id" class="col-12 sm-12 md-6">
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

            <!-- View More Button -->
            <div v-if="!postsStore.isLoading && postsStore.posts.length > 0"
                class="row padding-top-large margin-bottom-none">
                <div class="sm-12" style="text-align: center;">
                    <NuxtLink to="/posts">
                        <button>Lihat lebih banyak</button>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Empty State -->
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

/* Skeleton Styles */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s ease-in-out infinite;
    border-radius: 4px;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.skeleton-title {
    height: 24px;
    width: 70%;
    margin-bottom: 1rem;
}

.skeleton-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
}

.skeleton-subtitle {
    height: 18px;
    width: 100px;
    flex-grow: 1;
}

.skeleton-text {
    height: 16px;
    width: 100%;
    margin-bottom: 0.5rem;
}

.skeleton-text-short {
    width: 80%;
}

.skeleton-link {
    height: 16px;
    width: 50px;
}

.skeleton-views {
    height: 16px;
    width: 40px;
}
</style>