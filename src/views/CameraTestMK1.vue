<template>
    <div id="contents">
        <div class="camera">
            <video id="video" ref="video" @canplay="playVideo"></video>
            <button id="takephoto" @click="takePhoto">사진 찍기</button>
        </div>

        <canvas id= canvas ref="canvas"></canvas>

        <div class="output">
            <img id="photo" :src="photoSrc" alt="The screen capture will appear in this box."/>
        </div>
        <button @click="clearPhoto">사진 지우기</button>
    </div>
    <div>
      <video ref="video" autoplay></video>
      <canvas ref="canvas" :height="height" :width="width"></canvas>
      <button @click="playVideo">Play Video</button>
      <button @click="takePhoto">Take Photo</button>
      <button @click="clearPhoto">Clear Photo</button>
      <img :src="photoSrc" alt="Captured Photo" v-if="photoSrc" />
    </div>
  </template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  
  const video = ref(null);
  const canvas = ref(null);
  const photoSrc = ref(null);
  const streaming = ref(false);
  const height = ref(0);
  const width = ref(320);
  
  const getMediaStream = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        video.value.srcObject = stream;
        video.value.play();
      })
      .catch((err) => {
        console.error(`error occurred : ${err}`);
      });
  };
  
  const playVideo = () => {
    if (!streaming.value) {
      streaming.value = true;
      height.value = video.value.videoHeight / video.value.videoWidth * width.value;
  
      video.value.height = height.value;
      video.value.width = width.value;
      canvas.value.height = height.value;
      canvas.value.width = width.value;
    }
  };
  
  const takePhoto = () => {
    const context = canvas.value.getContext('2d');
    context.drawImage(video.value, 0, 0, width.value, height.value);
  
    photoSrc.value = canvas.value.toDataURL('image/png');
  };
  
  const clearPhoto = () => {
    const context = canvas.value.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, width.value, height.value);
  
    photoSrc.value = canvas.value.toDataURL('image/png');
  };
  
  onMounted(() => {
    video.value = video.value.$el;
    canvas.value = canvas.value.$el;
    getMediaStream();
    clearPhoto();
  });
  </script>
  
  <style scoped>
  #video {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width: 300px;
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
    display: inline-block;
  }
  
  .output {
    width: 340px;
    display: inline-block;
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