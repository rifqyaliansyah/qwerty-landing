<template>
    <nav class="container border fixed split-nav">
        <div class="nav-brand">
            <h3>
                <NuxtLink to="/">Kata-Ku</NuxtLink>
            </h3>
        </div>
        <div class="collapsible">
            <input id="collapsible1" type="checkbox" name="collapsible1">
            <label for="collapsible1">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
            </label>
            <div class="collapsible-body">
                <ul class="inline">
                    <li>
                        <NuxtLink to="/explore">Explore</NuxtLink>
                    </li>

                    <ClientOnly>
                        <template v-if="!authStore.isLoggedIn">
                            <li>
                                <NuxtLink to="/auth/login">Login</NuxtLink>
                            </li>
                        </template>

                        <template v-else>
                            <li>
                                <NuxtLink to="/qoutes">Tambah Kata</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/myqoutes">My Kata</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/profile" class="profile-link">
                                    <img :src="authStore.user?.avatar_url" :alt="authStore.user?.username"
                                        class="profile-avatar">
                                    Profile
                                </NuxtLink>
                            </li>
                        </template>
                    </ClientOnly>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
}
</script>

<style scoped>
.profile-link {
    display: inline-flex !important;
    align-items: center;
    gap: 11px;
    vertical-align: middle;
}

.profile-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #41403e;
    display: inline-block;
    object-fit: cover;
    object-position: center;
    flex-shrink: 0;
}
</style>