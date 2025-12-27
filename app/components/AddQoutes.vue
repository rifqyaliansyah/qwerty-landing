<script setup>
import { ref, computed } from 'vue'
import { PhEye } from '@phosphor-icons/vue'
import { useAuthStore } from '~/stores/auth'
import { usePostsStore } from '~/stores/posts'

const authStore = useAuthStore()
const postsStore = usePostsStore()

const judul = ref('')
const isi = ref('')
const backgroundColor = ref('')
const borderWidth = ref('border')
const borderStyle = ref('')
const borderColor = ref('border-primary')
const isAnonymous = ref(false)
const showModal = ref(false)

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

const openConfirmModal = () => {
    if (!isSaveDisabled.value) {
        showModal.value = true
    }
}

const handleConfirmSave = async () => {
    showModal.value = false

    try {
        const post = await postsStore.createPost({
            title: judul.value,
            content: isi.value,
            is_anonymous: isAnonymous.value,
            styling: {
                background_color: backgroundColor.value,
                border_width: borderWidth.value,
                border_style: borderStyle.value,
                border_color: borderColor.value
            }
        })

        // Reset form
        judul.value = ''
        isi.value = ''
        backgroundColor.value = ''
        borderWidth.value = 'border'
        borderStyle.value = ''
        borderColor.value = 'border-primary'
        isAnonymous.value = false

        // Optional: redirect ke halaman post yang baru dibuat
        if (post && post.slug) {
            // await navigateTo(`/posts/${post.slug}`)
            await navigateTo(`/`)
        }
    } catch (error) {
        console.error('Error creating post:', error)
        alert('Gagal membuat post. Silakan coba lagi.')
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="sm-12 md-6 card-center">
                <h3 class="padding-top-large margin-bottom-none">Preview</h3>
                <p class="padding-top-none margin-top-none">Nah, begini tampilan yang akan muncul.</p>
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
                                <NuxtLink class="card-link" to="#">Lihat</NuxtLink>
                                <span class="view-count">
                                    <PhEye :size="16" /> 1,234
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
                        <button :class="['btn-secondary', { 'btn-active': backgroundColor === 'background-secondary' }]"
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
                    {{ postsStore.isLoading ? 'Loading...' : 'Simpan' }}
                </button>
            </div>
        </div>

        <input class="modal-state" id="modal-confirm" type="checkbox" :checked="showModal"
            @change="showModal = $event.target.checked">
        <div class="modal">
            <label class="modal-bg" @click="showModal = false"></label>
            <div class="modal-body">
                <label class="btn-close" @click="showModal = false">X</label>
                <h4 class="modal-title">Konfirmasi Posting</h4>
                <h5 class="modal-subtitle">Yakin mau posting kata-kata ini?</h5>
                <p class="modal-text">Pastikan judul dan isi sudah benar ya. Styling juga udah oke kan?</p>
                <button class="btn-secondary" @click="handleConfirmSave">Ya, Posting!</button>
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

@media (max-width: 767px) {
    button {
        width: 100%;
    }
}
</style>