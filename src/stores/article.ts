import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { Article } from '@/common/types/index'
import axios from 'axios'


export const useArticleStore = defineStore('article', () => {
  const API_URL = 'http://localhost:9000'
  
  const router = useRouter()
  
  const articles = ref<Article[]>([])
  
  return { API_URL, articles, }
})
