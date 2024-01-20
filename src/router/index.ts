import { createRouter, createWebHistory } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { useUserStore } from '@/stores/user'

import HomeView from '../views/HomeView.vue'
// 회원
import SignUpView from '@/views/User/SignUpView.vue'
import LoginView from '@/views/User/LoginView.vue'
// 게시판
import ArticleView from '@/views/Article/ArticleView.vue'
import ArticleDetailView from '@/views/Article/ArticleDetailView.vue'
import ArticleCreateView from '@/views/Article/ArticleCreateView.vue'
// 채팅
import VideoChatView from '@/views/VideoChatView.vue'

import CameraTestMK3View from '@/views/CameraTestMK3.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // 회원
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },    
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    // 게시판
    {
      path: '/article',
      name: 'article',
      component: ArticleView
    },
    {
      path: '/article/:articleId',
      name: 'article-detail',
      component: ArticleDetailView
    },
    {
      path: '/article/create',
      name: 'article-create',
      component: ArticleCreateView
    },
    // 채팅
    {
      path: '/video-chat',
      name: 'video-chat',
      component: VideoChatView
    },
    {
      path: '/camera-test',
      name: 'camera-test',
      component: CameraTestMK3View,
    }
  ]
})

export default router
