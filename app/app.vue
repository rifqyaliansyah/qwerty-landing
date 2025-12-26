<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <div v-show="!authStore.authChecked" class="loading-container">
      <div class="loading-content">
        <h3>Kata-Ku</h3>
        <div class="progress">
          <div class="bar bar-indeterminate"></div>
        </div>
        <p>Loading...</p>
      </div>
    </div>
    <div v-show="authStore.authChecked">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
}

.loading-content {
  text-align: center;
  max-width: 300px;
  width: 100%;
}

.loading-content h3 {
  margin-bottom: 2rem;
}

.loading-content p {
  margin-top: 1rem;
  color: #666;
}

.progress {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border: 2px solid #41403e;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  background-color: #41403e;
  position: absolute;
  left: 0;
  top: 0;
}

.bar-indeterminate {
  width: 40%;
  animation: indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}

@keyframes indeterminate {
  0% {
    left: -40%;
  }

  100% {
    left: 100%;
  }
}
</style>