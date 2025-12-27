<script setup>
import { ref, computed, onMounted } from 'vue'
import { PhHeart } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'
import { usePostsStore } from '~/stores/posts'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const postsStore = usePostsStore()
const route = useRoute()
const router = useRouter()

const judul = ref('')
const isi = ref('')
const backgroundColor = ref('')
const borderWidth = ref('border')
const borderStyle = ref('')
const borderColor = ref('border-primary')
const isAnonymous = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const postSlug = ref(null)
const isLoadingPost = ref(false)

const isSaveDisabled = computed(() => {
    return !judul.value.trim() || !isi.value.trim()
})

const authorName = computed(() => {
    return isAnonymous.value ? 'Someone' : (authStore.user?.username || 'Penulis')
})

const authorAvatar = computed(() => {
    return isAnonymous.value
        ? '/images/default.jpg'
        : (authStore.user?.avatar_url)
})

const modalTitle = computed(() => {
    return isEditMode.value ? 'Konfirmasi Edit' : 'Konfirmasi Posting'
})

const modalSubtitle = computed(() => {
    return isEditMode.value ? 'Yakin mau update kata-kata ini?' : 'Yakin mau posting kata-kata ini?'
})

const modalText = computed(() => {
    return isEditMode.value
        ? 'Pastikan perubahan yang kamu buat sudah sesuai ya!'
        : 'Pastikan judul dan isi sudah benar ya. Styling juga udah oke kan?'
})

const buttonText = computed(() => {
    return isEditMode.value ? 'Ya, Update!' : 'Ya, Posting!'
})

const openConfirmModal = () => {
    if (!isSaveDisabled.value) {
        showModal.value = true
    }
}

const handleConfirmSave = async () => {
    showModal.value = false

    const postData = {
        title: judul.value,
        content: isi.value,
        is_anonymous: isAnonymous.value,
        styling: {
            background_color: backgroundColor.value,
            border_width: borderWidth.value,
            border_style: borderStyle.value,
            border_color: borderColor.value
        }
    }

    try {
        if (isEditMode.value) {
            // Update post
            const updatedPost = await postsStore.updatePost(postSlug.value, postData)

            if (updatedPost && updatedPost.slug) {
                await navigateTo(`/myqoutes`)
            }
        } else {
            // Create post
            const post = await postsStore.createPost(postData)

            // Reset form
            judul.value = ''
            isi.value = ''
            backgroundColor.value = ''
            borderWidth.value = 'border'
            borderStyle.value = ''
            borderColor.value = 'border-primary'
            isAnonymous.value = false

            if (post && post.slug) {
                await navigateTo(`/`)
            }
        }
    } catch (error) {
        console.error('Error saving post:', error)
        alert(isEditMode.value ? 'Gagal mengupdate post. Silakan coba lagi.' : 'Gagal membuat post. Silakan coba lagi.')
    }
}

const loadPostForEdit = async () => {
    if (!route.params.slug) return

    isLoadingPost.value = true
    isEditMode.value = true
    postSlug.value = route.params.slug

    try {
        const post = await postsStore.fetchPostBySlug(route.params.slug)

        // Check ownership
        if (post.user_id !== authStore.user?.id) {
            await navigateTo('/myqoutes')
            return
        }

        // Populate form with post data
        judul.value = post.title
        isi.value = post.content
        isAnonymous.value = post.is_anonymous

        if (post.styling) {
            backgroundColor.value = post.styling.background_color || ''
            borderWidth.value = post.styling.border_width || 'border'
            borderStyle.value = post.styling.border_style || ''
            borderColor.value = post.styling.border_color || 'border-primary'
        }
    } catch (error) {
        console.error('Error loading post:', error)
        alert('Gagal memuat post. Silakan coba lagi.')
        await navigateTo('/myqoutes')
    } finally {
        isLoadingPost.value = false
    }
}

onMounted(() => {
    window.scrollTo(0, 0)

    if (route.params.slug) {
        loadPostForEdit()
    }
})
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="sm-12 md-6 card-center">
                <!-- Skeleton Loading -->
                <div v-if="isLoadingPost">
                    <h3 class="padding-top-large margin-bottom-none">
                        <div class="skeleton skeleton-heading"></div>
                    </h3>
                    <p class="padding-top-none margin-top-none">
                    <div class="skeleton skeleton-subheading"></div>
                    </p>

                    <div class="card margin-right-small margin-bottom-small margin-top-small card-no-border">
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

                    <div class="margin-top-large margin-right-small">
                        <div class="skeleton skeleton-label"></div>
                        <div class="margin-top-small">
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                        </div>
                    </div>

                    <div class="margin-top-large margin-right-small">
                        <div class="skeleton skeleton-label"></div>
                        <div class="margin-top-small">
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                        </div>
                    </div>

                    <div class="margin-top-large margin-right-small">
                        <div class="skeleton skeleton-label"></div>
                        <div class="margin-top-small">
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                            <div class="skeleton skeleton-button-inline"></div>
                        </div>
                    </div>

                    <div class="form-group margin-top-large margin-right-small">
                        <div class="skeleton skeleton-label"></div>
                        <div class="skeleton skeleton-input"></div>
                    </div>

                    <div class="form-group margin-right-small">
                        <div class="skeleton skeleton-label"></div>
                        <div class="skeleton skeleton-textarea"></div>
                    </div>

                    <fieldset class="form-group">
                        <div class="skeleton skeleton-switch"></div>
                    </fieldset>

                    <div class="skeleton skeleton-button-full"></div>
                </div>

                <!-- Actual Form -->
                <div v-else>
                    <h3 class="padding-top-large margin-bottom-none">
                        {{ isEditMode ? 'Edit Kata Kata' : 'Preview' }}
                    </h3>
                    <p class="padding-top-none margin-top-none">
                        {{ isEditMode ? 'Edit kata-kata kamu dan lihat perubahannya.' : 'Nah, begini tampilan yang akan muncul.' }}
                    </p>
                    <ClientOnly>
                        <div class="card margin-right-small margin-bottom-small margin-top-small card-no-border">
                            <div
                                :class="['card-body', 'shadow-hover', 'shadow', 'border', backgroundColor, borderWidth, borderStyle, borderColor]">
                                <h4 class="card-title">{{ judul || 'Judul Kata kata' }}</h4>
                                <div class="card-author">
                                    <img :src="authorAvatar" :alt="authorName" class="author-avatar">
                                    <h5 class="card-subtitle">{{ authorName }}</h5>
                                </div>
                                <p class="card-text">{{ isi || '"Nggak semua hal harus selesai hari ini, yang penting kamu nggak berhenti."' }}
                                </p>
                                <div class="card-footer-inline">
                                    <span class="like-count">
                                        <PhHeart :size="20" weight="regular" class="heart-icon-static" />
                                        <span>0</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </ClientOnly>
                    <div class="margin-top-large margin-right-small">
                        <label>Background Color</label>
                        <div class="margin-top-small">
                            <button :class="['btn-block', '', { 'btn-active': backgroundColor === '' }]"
                                @click="backgroundColor = ''; borderColor = ''">
                                Default
                            </button>
                            <button :class="['btn-primary', { 'btn-active': backgroundColor === 'background-primary' }]"
                                @click="backgroundColor = 'background-primary'; borderColor = 'border-primary'">
                                Primary
                            </button>
                            <button
                                :class="['btn-secondary', { 'btn-active': backgroundColor === 'background-secondary' }]"
                                @click="backgroundColor = 'background-secondary'; borderColor = 'border-secondary'">
                                Secondary
                            </button>
                            <button :class="['btn-success', { 'btn-active': backgroundColor === 'background-success' }]"
                                @click="backgroundColor = 'background-success'; borderColor = 'border-success'">
                                Success
                            </button>
                            <button :class="['btn-warning', { 'btn-active': backgroundColor === 'background-warning' }]"
                                @click="backgroundColor = 'background-warning'; borderColor = 'border-warning'">
                                Warning
                            </button>
                            <button :class="['btn-danger', { 'btn-active': backgroundColor === 'background-danger' }]"
                                @click="backgroundColor = 'background-danger'; borderColor = 'border-danger'">
                                Danger
                            </button>
                        </div>
                    </div>
                    <div class="margin-top-large margin-right-small">
                        <label>Border</label>
                        <div class="margin-top-small">
                            <button :class="['btn-block', 'border', { 'btn-active': borderWidth === 'border' }]"
                                @click="borderWidth = 'border'">
                                Border Default
                            </button>
                            <button
                                :class="['btn-block', 'border', 'border-2', { 'btn-active': borderWidth === 'border-2' }]"
                                @click="borderWidth = 'border-2'">
                                Border-2
                            </button>
                            <button
                                :class="['btn-block', 'border', 'border-3', { 'btn-active': borderWidth === 'border-3' }]"
                                @click="borderWidth = 'border-3'">
                                Border-3
                            </button>
                            <button
                                :class="['btn-block', 'border', 'border-4', { 'btn-active': borderWidth === 'border-4' }]"
                                @click="borderWidth = 'border-4'">
                                Border-4
                            </button>
                            <button
                                :class="['btn-block', 'border', 'border-5', { 'btn-active': borderWidth === 'border-5' }]"
                                @click="borderWidth = 'border-5'">
                                Border-5
                            </button>
                            <button
                                :class="['btn-block', 'border', 'border-6', { 'btn-active': borderWidth === 'border-6' }]"
                                @click="borderWidth = 'border-6'">
                                Border-6
                            </button>
                        </div>
                    </div>
                    <div class="margin-top-large margin-right-small">
                        <label>Border Style</label>
                        <div class="margin-top-small">
                            <button :class="['btn-block', '', { 'btn-active': borderStyle === '' }]"
                                @click="borderStyle = ''">
                                Default
                            </button>
                            <button
                                :class="['btn-block', 'border-dashed', { 'btn-active': borderStyle === 'border-dashed' }]"
                                @click="borderStyle = 'border-dashed'">
                                Dashed
                            </button>
                            <button
                                :class="['btn-block', 'border-dotted', { 'btn-active': borderStyle === 'border-dotted' }]"
                                @click="borderStyle = 'border-dotted'">
                                Dotted
                            </button>
                            <button
                                :class="['btn-block', 'border-dashed', 'border-thick', { 'btn-active': borderStyle === 'border-dashed border-thick' }]"
                                @click="borderStyle = 'border-dashed border-thick'">
                                Dashed Thick
                            </button>
                            <button
                                :class="['btn-block', 'border-dotted', 'border-thick', { 'btn-active': borderStyle === 'border-dotted border-thick' }]"
                                @click="borderStyle = 'border-dotted border-thick'">
                                Dotted Thick
                            </button>
                        </div>
                    </div>
                    <div class="form-group margin-top-large margin-right-small">
                        <label for="paperInputs1">Judul Kata kata</label>
                        <input type="text" v-model="judul" placeholder="Masukkan judul kata kata" id="paperInputs1">
                    </div>
                    <div class="form-group margin-right-small">
                        <label for="large-input">Isi</label>
                        <textarea id="large-input" v-model="isi" placeholder="Masukkan isi"></textarea>
                    </div>
                    <fieldset class="form-group">
                        <label class="paper-switch">
                            <input id="paperSwitch5" name="paperSwitch5" type="checkbox" v-model="isAnonymous" />
                            <span class="paper-switch-slider"></span>
                        </label>
                        <label for="paperSwitch5" class="paper-switch-label">
                            Anonymous
                        </label>
                    </fieldset>
                    <button class="btn-secondary" :disabled="isSaveDisabled || postsStore.isLoading"
                        @click="openConfirmModal">
                        {{ postsStore.isLoading ? 'Loading...' : (isEditMode ? 'Update' : 'Simpan') }}
                    </button>
                </div>
            </div>
        </div>

        <input class="modal-state" id="modal-confirm" type="checkbox" :checked="showModal"
            @change="showModal = $event.target.checked">
        <div class="modal">
            <label class="modal-bg" @click="showModal = false"></label>
            <div class="modal-body">
                <label class="btn-close" @click="showModal = false">X</label>
                <h4 class="modal-title">{{ modalTitle }}</h4>
                <h5 class="modal-subtitle">{{ modalSubtitle }}</h5>
                <p class="modal-text">{{ modalText }}</p>
                <button class="btn-secondary" @click="handleConfirmSave">{{ buttonText }}</button>
                <button class="btn-danger" @click="showModal = false">Batal</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-center {
    margin: 0 auto;
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

.like-count {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    color: #666;
}

.heart-icon-static {
    color: #666;
    display: flex;
    align-items: center;
}

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
}

.card-author .card-subtitle {
    margin: 0;
}

.form-group {
    width: 100%;
}

.form-group input,
.form-group textarea {
    width: 100%;
    box-sizing: border-box;
}

.form-group textarea {
    resize: vertical;
}

.btn-block {
    display: inline-block;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.btn-active {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3) !important;
    transform: scale(1.05);
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

.skeleton-heading {
    height: 28px;
    width: 150px;
}

.skeleton-subheading {
    height: 18px;
    width: 300px;
}

.skeleton-label {
    height: 20px;
    width: 120px;
    margin-bottom: 0.5rem;
}

.skeleton-button-inline {
    display: inline-block;
    height: 40px;
    width: calc(16.666% - 0.5rem);
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.skeleton-button-full {
    height: 40px;
    width: 100%;
}

.skeleton-input {
    height: 45px;
    width: 100%;
    margin-top: 0.5rem;
}

.skeleton-textarea {
    height: 120px;
    width: 100%;
    margin-top: 0.5rem;
}

.skeleton-switch {
    height: 24px;
    width: 150px;
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

@media (max-width: 767px) {
    button {
        width: 100%;
    }

    .skeleton-button-inline {
        width: 100%;
        display: block;
    }
}
</style>