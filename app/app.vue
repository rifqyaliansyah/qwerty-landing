<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <div v-show="!authStore.authChecked"></div>
    <div v-show="authStore.authChecked">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>