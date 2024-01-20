<template>
    <div id="contents">
        <div class="camera">
            <video id="video" ref="video" @canplay="playVideo"></video>
        </div>
        
        <canvas id= canvas ref="canvas"></canvas>
        
        <div class="output">
            <img id="photo" :src="photoSrc" alt="The screen capture will appear in this box."/>
        </div>
        <div>
            <button @click="takePhoto">사진 찍기</button>
            <button @click="clearPhoto">사진 지우기</button>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const video = ref(null)
const canvas = ref(null)
const photoSrc = ref(null)
const streaming = ref(false)
const height = ref(0)
const width = ref(320)

const message = ref('')

let socket



const initializeWebSocket = () => {
  socket = new WebSocket("ws://localhost:8080/signal");
  console.log("@@@@@@@@@@@@")

  socket.addEventListener("open", (event) => {
    console.log("WebSocket 연결됨")
  })

  socket.addEventListener("message", (event) => {
    message.value = event.data
    console.log("서버로부터 메시지 수신: ", event.data)
  })

  socket.addEventListener("close", () => {
    console.log("WebSocket 연결 종료")
  })
}

const sendMessage = () => {
  if (socket) {
    socket.send("Hello Server!")
  }
}
  
const getMediaStream = () => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      video.value.srcObject = stream
      video.value.play()
    })
    .catch((err) => {
      console.error(`error occurred : ${err}`)
    })
}
  
const playVideo = () => {
  if (!streaming.value) {
    streaming.value = true;
    height.value = video.value.videoHeight / video.value.videoWidth * width.value

    video.value.height = height.value
    video.value.width = width.value
    canvas.value.height = height.value
    canvas.value.width = width.value
  }
}
  
const takePhoto = () => {
  const context = canvas.value.getContext('2d')
  context.drawImage(video.value, 0, 0, width.value, height.value)

  photoSrc.value = canvas.value.toDataURL('image/png')
}

const clearPhoto = () => {
  const context = canvas.value.getContext('2d')
  context.fillStyle = "#AAA"
  context.fillRect(0, 0, width.value, height.value)

  photoSrc.value = canvas.value.toDataURL('image/png')
}
  
onMounted(() => {
  getMediaStream()
  clearPhoto()
  initializeWebSocket();
})

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>
  
<style scoped>z
  #video {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width: 600px;
    height: 500px;
  }
  
  #photo {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width: 320px;
    height: 240px;
  }
  
  #canvas {
    display: none;
  }
  
  .camera {
    width: 340px;
  }
  
  .output {
    width: 340px;
    vertical-align: bottom;
  }
  
  #takephoto {
    display: block;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    bottom: 32px;
    background-color: rgba(0, 150, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-family: "Lucida Grande", "Arial", sans-serif;
    color: rgba(255, 255, 255, 1);
  }
</style>