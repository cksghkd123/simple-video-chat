<template>
    <div>
        {{ localUserName }} 님 안녕하세요
    </div>
    <div id="contents">
        <div class="camera">
            <video id="video" ref="localVideo" @canplay="playVideo"></video>
            <video id="video" ref="remoteVideo" autoplay></video>
        </div>
        

        <div>
            <button @click="videoOn">비디오 끄기</button>
            <button @click="videoOff">비디오 켜기</button>
            <button @click="audioOn">소리 끄기</button>
            <button @click="audioOff">소리 켜기!!</button>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user'

const store = useUserStore()

// 주소로 연결할 웹소켓 생성
let socket
// UI elements
const localVideo = ref(null)
const RoomNumber = ref('')
const localUserName = ref(store.userName)
const localRoom = ref(1)

const remoteVideo = ref(null)
// WebRTC STUN servers
const peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.stunprotocol.org:3478'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
}

// WebRTC media
const mediaConstraints = {
    audio: true,
    video: true
}

// WebRTC variables
let localStream;
let localVideoTracks;
let myPeerConnection;



// 버튼 조작 메서드

const videoOff = () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
}
const videoOn = () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
}
const audioOff = () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
}
const audioOn = () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
}


// 서버에게 메시지 전송 메서드
const sendToServer = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg))
    }
}

// WebSocket
const initializeWebSocket = () => {
    // socket = new WebSocket("ws://localhost:8080/signal")
    socket = new WebSocket("ws://ec2-54-180-112-122.ap-northeast-2.compute.amazonaws.com:8080/signal")

    socket.onmessage = (msg) => {
        let message = JSON.parse(msg.data)
        console.log("서버로부터 메시지가 도착했습니다!")
        console.log(message)
        // Join, Leave, Offer, Answer, Ice 의 data type이 있음
        switch (message.signalType) {
            case "text":
                console.log('Text message from ' + message.sender + ' received: ' + message.data)
                break

            case "Offer":
                console.log('Signal OFFER received')
                handleOfferMessage(message)
                break;

            case "Answer":
                console.log('Signal ANSWER received')
                handleAnswerMessage(message)
                break;

            case "Ice":
                console.log('Signal ICE Candidate received')
                handleICEMessage(message)
                break;

            case "Join":
                console.log('Client is starting to ' + (message.data === "true)" ? 'negotiate' : 'wait for a peer'))
                handleJoinMessage(message)
                break;

            default:
                handleErrorMessage('Wrong type message received from server')
        }
    };

    socket.onopen = () => {
        console.log('소켓 열렸는디요')
        sendToServer({
            sender: localUserName.value,
            signalType: 'Join',
            data: localRoom.value

        });
    };

    socket.onclose = () => {
        console.log('소켓 닫혔는디요')
    };

    socket.onerror = (error) => {
        console.errorr(error)
    };
}

// WebRTC
const initializeWebRTC = async () => {
    

    

}

// socket event 별 처리 메서드

const handleOfferMessage = async (message) => {
    try {
        const remoteDescription = new RTCSessionDescription(message.sdp)
        await myPeerConnection.setRemoteDescription(remoteDescription)

        const answer = await myPeerConnection.createAnswer()
        await myPeerConnection.setLocalDescription(answer)
        sendToServer({
            sender: localUserName.value,
            signalType: 'Answer',
            sdp: myPeerConnection.localDescription
        })
    } catch (error) {
        console.error('Error handling offer message: ', error)
    }
}

const handleAnswerMessage = (message) => {
    const remoteDescription = new RTCSessionDescription(message.sdp)
    myPeerConnection.setRemoteDescription(remoteDescription)
}

const handleICEMessage = (message) => {
    const candidate = new RTCIceCandidate(message.iceCandidate)
    myPeerConnection.addIceCandidate(candidate)
}

const handleJoinMessage = async (message) => {
    console.log("handling joing message!")
    // 내 media 출력
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    localVideo.value.srcObject = localStream
    localVideo.value.play()
    console.log("야호")

    // 다른 peer들을 위한 RTCPeerConnection을 만듬
    myPeerConnection = new RTCPeerConnection(peerConnectionConfig)
    
    // 
    myPeerConnection.onicecandidate = (event) =>{
        // ICE Candidate 정보를 서버로 보냄
        if (event.candidate) {
            sendToServer({
                sender: localUserName.value,
                signalType: 'Ice',
                iceCandidate: event.candidate
            })
            console.log('ICE Candidate Event: ICE candidate sent')
        }
    }
    // 원격 스트림을 받을 때 처리
    myPeerConnection.ontrack = (event) => {
        console.log('Track Event: set stream to remote video element')
        console.log('remoteVideo: ',event.streams[0])
        remoteVideo.value.srcObject = event.streams[0]
        remoteVideo.value.play()
    }

    // ICE 연결 상태 변경되면 로깅
    myPeerConnection.oniceconnectionstatechange = (event) => {
        console.log('ICE Connection State:', myPeerConnection.iceConnectionState)
    }

    if (message.data === "true") {
        console.log("11")
        myPeerConnection.onnegotiationneeded = async () => {
            try {   
                console.log("22")

                const offer = await myPeerConnection.createOffer()
                await myPeerConnection.setLocalDescription(offer)
                sendToServer({
                    sender: localUserName.value,
                    signalType: 'Offer',
                    sdp: myPeerConnection.localDescription
                })
                console.log('Negotiation Needed Event: SDP offer sent')
            } catch (reason) {
                // 연결 실패 시 오류 처리
                console.error('failure to connect error: ', reason)
            }
        }
    }

    // 내 media를 RTCPeerConnection에 추가
    localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream))

    
}


const handleErrorMessage = (message) => {
}


onMounted(async() => {
    await initializeWebRTC()
    initializeWebSocket()
})

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>


<style scoped>
#video {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width: 600px;
    height: 500px;
}

#canvas {
display: none;
}

</style>