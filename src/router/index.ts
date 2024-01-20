import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
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
