<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Register</h1>

      <!-- Error Message dari API -->
      <div v-if="errorMessage" class="error-message">
        <strong>{{ errorMessage }}</strong>

        <!-- Tampilkan detail errors jika ada -->
        <ul v-if="validationErrors && validationErrors.length > 0">
          <li v-for="(error, index) in validationErrors" :key="index">
            <strong>{{ error.field }}:</strong> {{ error.message }}
          </li>
        </ul>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="formData.name" type="text" placeholder="Enter your name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="formData.email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="formData.password" type="password" placeholder="Enter your password" required />
          <small class="hint">Password harus mengandung huruf besar, angka, dan karakter spesial (@$!%*?&#)</small>
        </div>

        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input id="password_confirmation" v-model="formData.password_confirmation" type="password" placeholder="Confirm your password" required />
        </div>

        <button type="submit" :disabled="authStore.loading" class="btn-submit">
          {{ authStore.loading ? 'Loading...' : 'Register' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account?
        <NuxtLink to="/login">Login here</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const validationErrors = ref(null)
const errorMessage = ref(null)
const successMessage = ref(null)

const handleRegister = async () => {
  validationErrors.value = null
  errorMessage.value = null
  successMessage.value = null

  const result = await authStore.register(formData.value)

  if (result.success) {
    successMessage.value = result.message || 'Registration successful! Redirecting...'

    console.log('User registered:', result.data.user)
    console.log('Token:', result.data.token)

    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } else {
    // Tampilkan error message dan validation errors
    errorMessage.value = result.message || 'Registration failed'

    if (result.errors && result.errors.length > 0) {
      validationErrors.value = result.errors
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #c62828;
}

.error-message strong {
  display: block;
  margin-bottom: 8px;
}

.error-message ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.error-message li {
  margin-bottom: 5px;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #2e7d32;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>