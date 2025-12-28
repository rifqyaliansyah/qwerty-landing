<script setup>
import { onMounted, ref, computed } from 'vue'
import { PhHeart } from '@phosphor-icons/vue'
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()

const showLoginModal = ref(false)

// Computed untuk mengambil data dari store
const mostLikedPosts = computed(() => postsStore.mostLikedPosts)
const isLoading = computed(() => postsStore.isLoading)

const toggleLike = async (post) => {
    if (!authStore.isLoggedIn) {
        showLoginModal.value = true
        return
    }

    try {
        await postsStore.toggleLike(post.slug)
    } catch (error) {
        console.error('Error toggling like:', error)
    }
}

const handleGoToLogin = () => {
    showLoginModal.value = false
    router.push('/auth/login')
}

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
    await postsStore.fetchMostLikedPosts(1, 4)
})
</script>

<template>
    <div class="container">
        <h3 class="padding-top-large margin-bottom-none">Kata-Kata Paling Populer</h3>
        <p class="padding-top-none margin-top-none">Yuk, intip kata-kata yang lagi banyak dibaca.</p>

        <!-- Modal Login -->
        <input class="modal-state" id="modal-login-popular" type="checkbox" :checked="showLoginModal"
            @change="showLoginModal = $event.target.checked">
        <div class="modal">
            <label class="modal-bg" @click="showLoginModal = false"></label>
            <div class="modal-body">
                <label class="btn-close" @click="showLoginModal = false">X</label>
                <h4 class="modal-title">Login Diperlukan</h4>
                <h5 class="modal-subtitle">Kamu harus login dulu</h5>
                <p class="modal-text">Silakan login terlebih dahulu untuk like post.</p>
                <button class="btn-secondary" @click="handleGoToLogin">Login</button>
                <button class="btn-danger" @click="showLoginModal = false">Batal</button>
            </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="row">
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
                            <div class="skeleton skeleton-heart"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actual Posts -->
        <div v-else class="row">
            <div v-for="post in mostLikedPosts" :key="post.id" class="col-12 sm-12 md-6">
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
                            <span class="view-count">
                                <PhHeart :size="20" :weight="post.is_liked_by_user ? 'fill' : 'regular'"
                                    @click="toggleLike(post)" class="heart-icon"
                                    :class="{ 'liked': post.is_liked_by_user }" />
                                {{ post.likes_count || 0 }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="mostLikedPosts.length === 0" class="col-12 text-center padding-large">
                <p>Belum ada post populer yang tersedia.</p>
            </div>
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
    align-items: center;
}

.view-count {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    color: #666;
}

.heart-icon {
    cursor: pointer;
    transition: all 0.3s ease;
}

.heart-icon:hover {
    transform: scale(1.2);
}

.heart-icon.liked {
    color: #ff0000;
}

/* Modal Styles */
.modal-body {
    text-align: left;
}

.modal-title,
.modal-subtitle {
    text-align: left;
}

.modal-text {
    text-align: left;
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

.skeleton-heart {
    height: 20px;
    width: 50px;
}
</style>