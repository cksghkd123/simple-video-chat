<template>
  <RouterLink to="/video-chat">Go Video Chatting</RouterLink>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()

</script>