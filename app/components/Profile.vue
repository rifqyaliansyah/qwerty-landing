<template>
    <ClientOnly>
        <div class="container">
            <div class="row">
                <div class="sm-12 md-6 profile-center padding-bottom-large">
                    <div class="profile-header">
                        <img :src="authStore.user?.avatar_url || '/default-avatar.png'" alt="Profile"
                            class="profile-image">
                        <h3>{{ authStore.user?.username || 'Loading...' }}'s Profile</h3>
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
                        <div class="form-group">
                            <label for="paperInputs1">Username</label>
                            <input v-model="form.username" type="text" placeholder="Masukkan username" id="paperInputs1"
                                :disabled="authStore.loading">
                        </div>

                        <div class="form-group">
                            <label for="paperInputs2">Email</label>
                            <input v-model="form.email" type="email" placeholder="Masukkan email" id="paperInputs2"
                                disabled>
                        </div>

                        <div class="form-group">
                            <label for="paperInputs3">Update Profile Image</label>
                            <input type="file" id="paperInputs3" @change="handleFileChange" accept="image/*"
                                :disabled="authStore.loading">
                        </div>

                        <button type="submit" class="btn-secondary" :disabled="authStore.loading || !hasChanges">
                            {{ authStore.loading ? 'Loading...' : 'Update' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <template #fallback>
            <div class="container">
                <div class="row">
                    <div class="sm-12 md-6 profile-center">
                        <p>Loading...</p>
                    </div>
                </div>
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
.profile-center {
    margin: 0 auto;
    padding-top: 100px;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #41403e;
    object-fit: cover;
}

.profile-header h3 {
    margin: 0;
    text-align: center;
}

.form-group {
    width: 100%;
    margin-bottom: 20px;
}

.form-group input {
    width: 100%;
    box-sizing: border-box;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.modal-body {
    text-align: center;
}

/* Responsive untuk mobile */
@media (max-width: 767px) {
    .profile-center {
        padding-top: 100px;
    }

    .profile-image {
        width: 120px;
        height: 120px;
    }

    button {
        width: 100%;
    }
}
</style>