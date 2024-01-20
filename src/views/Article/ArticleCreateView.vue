<template>
  <main>
    <h1>게시글 작성</h1>
    <form @submit.prevent="createArticle">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" v-model.trim="title" id="title" placeholder="제목을 입력하세요">
      </div>
      <div class="mb-3">
        <label for="textarea" class="form-label">Title</label>
        <textarea type="text" class="form-control" rows="10" v-model.trim="content" id="content" placeholder="내용을 입력하세요"></textarea>
      </div>
      <button type="submit">제출</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useArticleStore } from '@/stores/article'
import { useRouter } from 'vue-router'
import { Article } from '@/common/types/index'
import axios from 'axios'

const store = useArticleStore()
const router = useRouter()

const title = ref<string>('')
const content = ref<string>('')

const createArticle = function () {
  axios({
    method: 'post',
    url: `${store.API_URL}/boards`,
    data: {
      title: title.value,
      content: content.value
    },
    // headers: {
    //   Authorization: `Token ${store.token}`
    // }
  })
    .then((res) => {
      router.push({ name: "ArticleView" })
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
