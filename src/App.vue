<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/article">Article</RouterLink> |
        
        <RouterLink to="/signUp">Signup</RouterLink> |
        <RouterLink to="/logIn">Login</RouterLink> | 
        <span @click="logOut">Logout</span>
      </nav>
  </header>

  <RouterLink to="/video-chat">Go Video Chatting</RouterLink>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()

function logOut() {
  router.push({ name : 'home'})

}
</script>