import { useEffect, useState } from 'react'

export default function Receiver() {
    const [receiverSocket,setReceiverSocket] = useState<null|WebSocket>(null);
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        setReceiverSocket(socket);
        socket.onopen = ()=>{
            socket.send(JSON.stringify({'type':"identified-as-receiver"}))
        }
        socket.onmessage = async (event)=>{
            console.log('[Receiver] Raw message:', event.data)
            const message = JSON.parse(event.data);
            let pc:RTCPeerConnection|null = null;
            if(message.type === 'offer'){
                const senderSDP = message.sdp;
                console.log("The sdp of the sender is ",senderSDP)
                pc = new RTCPeerConnection();
                await pc.setRemoteDescription(senderSDP);
                pc.onicecandidate = (event)=>{
                    console.log(event);
                    if(event.candidate){
                        socket?.send(JSON.stringify({type:"AddIceCandidate",candidate:event.candidate}))
                    }
                }
                pc.ontrack = (event)=>{
                    console.log("The tracks is",event.streams);
                    const videoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
                    console.log("the video element data is",videoElement)
                    if(videoElement) {
                        videoElement.srcObject = event.streams[0];
                    }
                }
                const anwser = await pc.createAnswer();
                await pc.setLocalDescription(anwser);
                console.log("The receiver answer is ",pc.localDescription);
                // senderSocket?.send(JSON.stringify({'type':"sendOffer","sdp":pc.localDescription}))
                socket?.send(JSON.stringify({'type':"sendAnswer","sdp":pc.localDescription}))
            }else if(message.type === 'AddIceCandidate'){
                if(pc!==null){
                    //@ts-ignore
                    pc.addIceCandidate(message.candidate);
                }
            }
        }

        
    },[])
  return (
    <div>
        <h2>Receiver</h2>
        <video id="remoteVideo" autoPlay playsInline width={500} />
    </div>
  )
}
