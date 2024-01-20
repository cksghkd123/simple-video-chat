<template>
    <input v-model="nameInput">
    <button @click="enter"> 입장하기 </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const nameInput = ref('')
const router = useRouter()
const store = useUserStore()

const enter = () => {
    if (nameInput.value) {
        store.userName = nameInput.value
        router.push('camera-test')
    } else {
        alert('이름을 입력하세요')
    }
}

</script>
    

<style>
</style>

