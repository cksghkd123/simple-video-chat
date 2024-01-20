<template>
  <main>
    <div>Article</div>
    
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'


const store = useArticleStore()

</script>