<script setup>
import { onMounted, ref, computed } from 'vue'
import { PhHeart, PhDotsThreeVertical, PhPencilSimple, PhTrash } from '@phosphor-icons/vue'
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'

const postsStore = usePostsStore()
const authStore = useAuthStore()

const currentPage = ref(1)
const isLoadingMore = ref(false)
const openMenuId = ref(null)
const showDeleteModal = ref(false)
const postToDelete = ref(null)

const toggleLike = async (post) => {
    try {
        await postsStore.toggleLike(post.slug)
    } catch (error) {
        console.error('Error toggling like:', error)
    }
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

const loadMore = async () => {
    isLoadingMore.value = true
    currentPage.value++
    await postsStore.fetchMyPosts(currentPage.value, 4)
    isLoadingMore.value = false
}

const hasMorePosts = computed(() => {
    const pagination = postsStore.myPostsPagination
    return pagination && currentPage.value < pagination.total_pages
})

const toggleMenu = (postId) => {
    if (openMenuId.value === postId) {
        openMenuId.value = null
    } else {
        openMenuId.value = postId
    }
}

const closeMenu = () => {
    openMenuId.value = null
}

const handleEdit = (post) => {
    closeMenu()
    navigateTo(`/qoutes/${post.slug}/edit`)
}

const openDeleteModal = (post) => {
    closeMenu()
    postToDelete.value = post
    showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
    if (!postToDelete.value) return

    try {
        await postsStore.deletePost(postToDelete.value.slug)
        showDeleteModal.value = false
        postToDelete.value = null

        // Refresh posts
        await postsStore.fetchMyPosts(1, 4)
        currentPage.value = 1
    } catch (error) {
        console.error('Error deleting post:', error)
        alert('Gagal menghapus post. Silakan coba lagi.')
    }
}

const cancelDelete = () => {
    showDeleteModal.value = false
    postToDelete.value = null
}

onMounted(async () => {
    await postsStore.fetchMyPosts(1, 4)

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.post-menu-container')) {
            closeMenu()
        }
    })
})
</script>

<template>
    <div class="container padding-top-large padding-bottom-none">
        <h3 class="padding-top-medium margin-bottom-none">Jejak Kata</h3>
        <p class="padding-top-none margin-top-none">Setiap kutipan menyimpan cerita yang pernah kamu tuliskan.</p>

        <!-- Skeleton Loading -->
        <div v-if="postsStore.isLoading && currentPage === 1" class="row">
            <div v-for="i in 4" :key="`skeleton-${i}`" class="col-12 sm-12 md-6">
                <div
                    class="card margin-right-small margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div class="card-body shadow border">
                        <!-- Skeleton Three Dots -->
                        <div class="post-menu-container">
                            <div class="skeleton skeleton-dots"></div>
                        </div>

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
            <div v-for="post in postsStore.myPosts" :key="post.id" class="col-12 sm-12 md-6">
                <div
                    class="card margin-right-small margin-left-small margin-bottom-small margin-top-small card-no-border">
                    <div :class="[
                        'card-body',
                        'shadow',
                        'border',
                        getStyling(post).backgroundColor,
                        getStyling(post).borderWidth,
                        getStyling(post).borderStyle,
                        getStyling(post).borderColor
                    ]">
                        <!-- Three Dots Menu -->
                        <div class="post-menu-container">
                            <button :class="['menu-toggle', 'border', getStyling(post).borderColor]"
                                @click.stop="toggleMenu(post.id)">
                                <PhDotsThreeVertical :size="20" weight="bold" />
                            </button>

                            <!-- Dropdown Menu -->
                            <div v-if="openMenuId === post.id" class="menu-dropdown">
                                <button @click="handleEdit(post)" class="menu-item">
                                    <PhPencilSimple :size="16" weight="bold" />
                                    <span>Edit</span>
                                </button>
                                <button @click="openDeleteModal(post)" class="menu-item menu-item-delete">
                                    <PhTrash :size="16" weight="bold" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

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

            <!-- Load More Button -->
            <div v-if="!postsStore.isLoading && postsStore.myPosts.length > 0 && hasMorePosts"
                class="row padding-top-large margin-bottom-none">
                <div class="sm-12" style="text-align: center;">
                    <button @click="loadMore" :disabled="isLoadingMore">
                        {{ isLoadingMore ? 'Loading...' : 'Lihat lebih banyak' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!postsStore.isLoading && postsStore.myPosts.length === 0" class="text-center padding-large">
            <p>Kamu belum membuat kata-kata apa pun. Mulai dengan membuat kata pertama kamu.</p>
            <NuxtLink to="/qoutes">
                <button class="btn-secondary margin-top">Yuk, Buat Sekarang</button>
            </NuxtLink>
        </div>

        <!-- Delete Confirmation Modal -->
        <input class="modal-state" id="modal-delete" type="checkbox" :checked="showDeleteModal"
            @change="showDeleteModal = $event.target.checked">
        <div class="modal">
            <label class="modal-bg" @click="cancelDelete"></label>
            <div class="modal-body">
                <label class="btn-close" @click="cancelDelete">X</label>
                <h4 class="modal-title">Konfirmasi Hapus</h4>
                <h5 class="modal-subtitle">Yakin mau hapus kata-kata ini?</h5>
                <p class="modal-text">Post yang sudah dihapus nggak bisa dikembalikan lagi. Pastikan kamu yakin ya!</p>
                <p class="modal-text" v-if="postToDelete"><strong>"{{ postToDelete.title }}"</strong></p>
                <button class="btn-danger" @click="handleConfirmDelete" :disabled="postsStore.isLoading">
                    {{ postsStore.isLoading ? 'Loading...' : 'Ya, Hapus!' }}
                </button>
                <button class="btn-secondary" @click="cancelDelete">Batal</button>
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
    position: relative;
}

.card-title {
    padding-right: 40px;
    word-wrap: break-word;
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

/* Menu Styles */
.post-menu-container {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
}

.menu-toggle {
    background: white;
    padding: 4px;
    cursor: pointer;
    color: #41403e;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: white;
    border: 2px solid #41403e;
    min-width: 120px;
    white-space: nowrap;
    z-index: 10;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    color: #41403e;
    font-size: 0.9rem;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item-delete {
    color: #d32f2f;
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

.skeleton-dots {
    width: 28px;
    height: 28px;
    border-radius: 0;
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

.modal {
    z-index: 9999;
}

@media (max-width: 520px) {
    .menu-item {
        margin: 0;
    }
}
</style>