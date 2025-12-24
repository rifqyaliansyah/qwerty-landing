<template>
    <div class="container center-container">
        <div class="card login-card">
            <div class="card-body">
                <h3 class="card-title card-title-center margin-bottom-none" style="margin-bottom: 0;">Kata-Ku</h3>
                <h5 class="card-title card-title-center">Login Akun</h5>

                <div v-if="authStore.successMessage">
                    <input class="alert-state" id="alert-success" type="checkbox">
                    <div class="alert alert-success dismissible">
                        {{ authStore.successMessage }}
                        <label class="btn-close" for="alert-success" @click="authStore.clearSuccess()">X</label>
                    </div>
                </div>

                <div v-if="authStore.errors.length > 0">
                    <input class="alert-state" id="alert-error" type="checkbox">
                    <div class="alert alert-danger dismissible">
                        <ul style="margin: 0; padding-left: 0.5rem;">
                            <li v-for="(error, index) in authStore.errors" :key="index">
                                {{ error }}
                            </li>
                        </ul>
                        <label class="btn-close" for="alert-error" @click="authStore.clearErrors()">X</label>
                    </div>
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label>Email</label>
                        <input v-model="form.email" class="input-block" type="email" placeholder="Masukkan email"
                            required :disabled="authStore.loading">
                    </div>

                    <div class="form-group">
                        <label>Password</label>
                        <input v-model="form.password" class="input-block" type="password"
                            placeholder="Masukkan password" required :disabled="authStore.loading">
                    </div>

                    <h5 class="card-title">Belum Punya Akun? <NuxtLink to="/auth/register"><b>Daftar</b></NuxtLink>
                    </h5>

                    <button type="submit" :disabled="authStore.loading">
                        {{ authStore.loading ? 'Loading...' : 'Login' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const form = reactive({
    email: '',
    password: ''
})

const handleSubmit = async () => {
    authStore.clearErrors()
    authStore.clearSuccess()

    try {
        await authStore.login(form)
    } catch (e) {
        console.error('Error:', e)
    }
}

watch(() => [form.email, form.password], () => {
    if (authStore.errors.length > 0) {
        authStore.clearErrors()
    }
})
</script>

<style scoped>
.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.login-card {
    width: 20rem;
}

.card-title-center {
    text-align: center;
}

button:disabled,
input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>