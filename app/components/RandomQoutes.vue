<script setup>
import { ref, onMounted } from 'vue'
import { useQuoteStore } from '~/stores/qoutes'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const quoteStore = useQuoteStore()
const authStore = useAuthStore()
const router = useRouter()

const showLoginModal = ref(false)

const handleGenerate = async () => {
    // Check if user is logged in
    if (!authStore.isLoggedIn) {
        showLoginModal.value = true
        return
    }

    try {
        await quoteStore.generateQuote()
    } catch (error) {
        console.error('Error generating quote:', error)
    }
}

const handleGoToLogin = () => {
    showLoginModal.value = false
    router.push('/auth/login')
}

const getDisplayQuote = () => {
    if (quoteStore.currentQuote) {
        return quoteStore.currentQuote
    }
    return 'Kata dari AI akan muncul di sini setelah kamu menekan tombol.'
}

// Initialize quote from localStorage on mount
onMounted(() => {
    quoteStore.initializeQuote()
})
</script>

<template>
    <div class="container">
        <h3 class="padding-top-medium margin-bottom-none">Kata-Kata Acak</h3>
        <p class="padding-top-none margin-top-none">Satu klik untuk melihat kata-kata yang dihasilkan secara acak.</p>

        <!-- Modal Login -->
        <input class="modal-state" id="modal-login-quote" type="checkbox" :checked="showLoginModal"
            @change="showLoginModal = $event.target.checked">
        <div class="modal">
            <label class="modal-bg" @click="showLoginModal = false"></label>
            <div class="modal-body">
                <label class="btn-close" @click="showLoginModal = false">X</label>
                <h4 class="modal-title">Login Diperlukan</h4>
                <h5 class="modal-subtitle">Kamu harus login dulu</h5>
                <p class="modal-text">Silakan login terlebih dahulu untuk generate kata-kata.</p>
                <button class="btn-secondary" @click="handleGoToLogin">Login</button>
                <button class="btn-danger" @click="showLoginModal = false">Batal</button>
            </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="quoteStore.isLoading" class="quote-skeleton-container">
            <div class="skeleton skeleton-quote"></div>
            <div class="skeleton skeleton-quote"></div>
            <div class="skeleton skeleton-quote skeleton-quote-short"></div>
        </div>

        <!-- Actual Quote -->
        <h3 v-else class="quote-text">"{{ getDisplayQuote() }}"</h3>

        <!-- Error Message -->
        <p v-if="quoteStore.error" class="error-message">{{ quoteStore.error }}</p>

        <!-- Generate Button -->
        <button class="btn-secondary" @click="handleGenerate" :disabled="quoteStore.isLoading">
            {{ quoteStore.isLoading ? 'Generating...' : 'Generate Kata' }}
        </button>
    </div>
</template>

<style scoped>
.quote-text {
    font-style: italic;
    margin: 1.5rem 0;
}

.quote-skeleton-container {
    margin: 1.5rem 0;
}

.error-message {
    color: #e74c3c;
    text-align: center;
    margin: 1rem 0;
    font-size: 0.9rem;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Skeleton Animation */
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

.skeleton-quote {
    height: 20px;
    width: 100%;
    margin-bottom: 0.8rem;
}

.skeleton-quote-short {
    width: 70%;
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

.modal {
    z-index: 9999;
}

@media (max-width: 767px) {
    button {
        width: 100%;
    }
}
</style>