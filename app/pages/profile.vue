<script setup>
definePageMeta({
    middleware: 'auth'
})
</script>

<template>
    <Navbar />
    <Profile />
    <Footer />
</template>