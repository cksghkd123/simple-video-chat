import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

import type { SignUp, LogIn } from '@/common/types/index'

export const useUserStore = defineStore('user', () => {

  const API_URL = 'http://localhost:9000'
  
  const router = useRouter()

  const userName = ref('')

  const signUp = function (payload: SignUp): void {
    const { username, password, email } = payload
    axios({
      method: 'post',
      url: `${API_URL}/users/new`,
      data: {
        username, password, email
      }
    })
      .then(res => {
        console.log(payload)
        window.alert('회원가입완료')
      })
      .catch(err => {
        console.log(err)
      })
  }


  const logIn = function (payload: LogIn) : void {
    const { username, password } = payload
    axios({
      method: 'post',
      url: `${API_URL}/users/login`,
      data: {
        username, password
      }
    })
      .then(res => { 
        console.log(payload)
        // 먼가 토큰먼가?
        window.alert('로그인 성공!')
        router.push({ name : 'home' })
      })
      .catch(err => {
        console.log(err)
      })

  }
  return { API_URL, signUp, logIn, userName }
})
