import { useEffect, useState } from "react"

export default function Sender() {
    const [senderSocket,setSenderSocket] = useState<null|WebSocket>(null);
    
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        setSenderSocket(socket);
        socket.onopen = ()=>{
            socket.send(JSON.stringify({'type':"identified-as-sender"}))
        }
    },[])

    async function sendVideo() {
        // Create an offer steps are :-
        // 1. Create Instance of webRTC 
        // 2. Create an offer
        const pc = new RTCPeerConnection();

        pc.onnegotiationneeded= async ()=>{
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("The sender offfer is ",offer.sdp);
            senderSocket?.send(JSON.stringify({'type':"sendOffer","sdp":pc.localDescription}))
        }
        
        if(senderSocket){
            senderSocket.onmessage =  async (event)=>{
                const message = JSON.parse(event.data);
                if(message.type === 'answer'){
                    const receiverSDP = message.sdp;
                    console.log("The sdp of the receiver is ",receiverSDP)
                    await pc.setRemoteDescription(receiverSDP);
                }
            }
        }

        pc.onicecandidate = (event)=>{
            console.log(event);
            if(event.candidate){
                senderSocket?.send(JSON.stringify({type:"AddIceCandidate",candidate:event.candidate}))
            }
        }
        const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
        pc.addTrack(stream.getVideoTracks()[0], stream);
    }

  return (
    <div>
        <h5>Sender</h5>
        <button onClick={sendVideo}>Send Video</button>
    </div>
  )
}
