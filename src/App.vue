<script setup>
import Nav from './components/Nav.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Nav />
  <router-view />
  <Footer />
</template>

<style scoped>
body {
  background: #f8f9fa;
}
</style>
