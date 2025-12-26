<template>
    <ClientOnly>
        <div class="container profile-container">
            <div class="row profile-header">
                <div class="sm-12">
                    <div class="profile-preview">
                        <img :src="authStore.user?.avatar_url || '/default-avatar.png'" alt="Profile"
                            class="profile-preview-image">
                        <h4>{{ authStore.user?.username || 'Loading...' }}'s Profile</h4>
                    </div>
                </div>
            </div>

            <!-- Modal Success -->
            <input class="modal-state" id="modal-success" type="checkbox" v-model="showSuccessModal">
            <div class="modal">
                <label class="modal-bg" for="modal-success"></label>
                <div class="modal-body">
                    <h4 class="modal-title">Berhasil!</h4>
                    <p class="modal-text">Profile berhasil diupdate</p>
                    <label class="paper-btn" for="modal-success">OK</label>
                </div>
            </div>

            <!-- Modal Error -->
            <input class="modal-state" id="modal-error" type="checkbox" v-model="showErrorModal">
            <div class="modal">
                <label class="modal-bg" for="modal-error"></label>
                <div class="modal-body">
                    <h4 class="modal-title">Error!</h4>
                    <div class="modal-text">
                        <ul style="margin: 0; padding-left: 1.5rem; text-align: left;">
                            <li v-for="(error, index) in authStore.errors" :key="index">
                                {{ error }}
                            </li>
                        </ul>
                    </div>
                    <label class="paper-btn" for="modal-error">OK</label>
                </div>
            </div>

            <form @submit.prevent="handleUpdate">
                <div class="row">
                    <div class="sm-12 md-6">
                        <div class="form-group form-spacing">
                            <label for="paperInputs1">Username</label>
                            <input v-model="form.username" class="input-block" type="text"
                                placeholder="Masukkan username" id="paperInputs1" :disabled="authStore.loading">
                        </div>
                    </div>
                    <div class="sm-12 md-6">
                        <div class="form-group form-spacing">
                            <label for="paperInputs2">Email</label>
                            <input v-model="form.email" class="input-block" type="email" placeholder="Masukkan email"
                                id="paperInputs2" disabled>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="sm-12">
                        <div class="form-group">
                            <label for="paperInputs3">Update Profile Image</label>
                            <input type="file" id="paperInputs3" @change="handleFileChange" accept="image/*"
                                :disabled="authStore.loading">
                        </div>
                        <button type="submit" class="btn-secondary" :disabled="authStore.loading || !hasChanges">
                            {{ authStore.loading ? 'Loading...' : 'Update' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <template #fallback>
            <div class="container profile-container">
                <p>Loading...</p>
            </div>
        </template>
    </ClientOnly>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const form = reactive({
    username: '',
    email: ''
})

const selectedFile = ref(null)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

// Computed untuk cek ada perubahan atau tidak
const hasChanges = computed(() => {
    const usernameChanged = form.username !== authStore.user?.username
    const fileSelected = selectedFile.value !== null
    return usernameChanged || fileSelected
})

const syncFormData = () => {
    if (authStore.user) {
        form.username = authStore.user.username || ''
        form.email = authStore.user.email || ''
    }
}

onMounted(() => {
    syncFormData()
    authStore.clearErrors()
    authStore.clearSuccess()
})

// Watch untuk success message
watch(() => authStore.successMessage, (newVal) => {
    if (newVal) {
        showSuccessModal.value = true
    }
})

// Watch untuk errors
watch(() => authStore.errors.length, (newVal) => {
    if (newVal > 0) {
        showErrorModal.value = true
    }
})

// Watch ketika modal ditutup, clear message
watch(showSuccessModal, (newVal) => {
    if (!newVal) {
        authStore.clearSuccess()
    }
})

watch(showErrorModal, (newVal) => {
    if (!newVal) {
        authStore.clearErrors()
    }
})

watch(() => authStore.user, (newUser) => {
    if (newUser) {
        syncFormData()
    }
}, { deep: true, immediate: true })

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            authStore.errors = ['File harus berupa gambar']
            event.target.value = ''
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            authStore.errors = ['Ukuran file maksimal 2MB']
            event.target.value = ''
            return
        }

        selectedFile.value = file
    }
}

const handleUpdate = async () => {
    if (!hasChanges.value) return

    authStore.clearErrors()
    authStore.clearSuccess()

    try {
        if (form.username !== authStore.user.username) {
            await authStore.updateProfile({ username: form.username })
        }

        if (selectedFile.value) {
            await authStore.uploadAvatar(selectedFile.value)
            selectedFile.value = null
            document.getElementById('paperInputs3').value = ''
        }
    } catch (e) {
        console.error('Update error:', e)
    }
}
</script>

<style scoped>
.profile-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    max-width: 800px;
    padding-top: 60px;
}

.profile-header {
    margin-bottom: 30px;
}

.profile-preview {
    display: flex;
    align-items: center;
    gap: 30px;
    justify-content: center;
}

.profile-preview-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #41403e;
    object-fit: cover;
}

.profile-preview h4 {
    margin: 0;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.modal-body {
    text-align: center;
}
</style>