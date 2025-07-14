import {WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port:8080})

let senderSocket : null| WebSocket = null;
let receiverSocket :null| WebSocket = null;

// wss.on("connection",(ws)=>{
//     ws.on('error',(e)=>{
//         console.log("The error is ",e);
//     });
//     ws.on('message',(data:any)=>{
//         const message = JSON.parse(data);
//         console.log("The message is ",message);
//         if(message.type === 'sender'){
//             senderSocket = ws;
//         }else if(message.type === 'receiver'){
//             receiverSocket = ws;
//         }else if(message.type === 'createOffer'){
//             if(ws !== senderSocket){
//                 return;
//             }
//             receiverSocket?.send(JSON.stringify({type:'createOffer',sdp:message.sdp}))
//         }
//         else if(message.type === 'createAnswer'){
//             if(ws!==receiverSocket){
//                 return;
//             }
//             senderSocket?.send(JSON.stringify({type:'createAnswer',sdp:message.sdp}))
//         }else if(message.type === 'iceCandidate'){
//             if(ws === senderSocket){
//                 receiverSocket?.send(JSON.stringify({type:'iceCandidate',candidate:message.candiate}))
//             }else if(ws === receiverSocket){
//                 senderSocket?.send(JSON.stringify({type:'iceCandidate',candidate:message.candiate}))
//             }
//         }
        
//     });
//     ws.send('something');
// });


wss.on("connection",(ws)=>{

    ws.on('error',(e)=>{
        console.log("The error is ",e);
    });

    ws.on('message',(data:any)=>{
        const message = JSON.parse(data);
        console.log("The message is ",message);
        if(message.type==='identified-as-sender'){
            senderSocket = ws;
        }
        else if(message.type==='identified-as-receiver'){
            receiverSocket = ws;
        }
        else if(message.type ==='sendOffer'){
            console.log("The ws : ",ws,"and the sender ws :",senderSocket);
            // if(ws !== senderSocket) return;
            console.log("The Sdp i got from the sender",message.sdp)
            receiverSocket?.send(JSON.stringify({type:'offer',sdp:message.sdp}))
        }else if(message.type ==='sendAnswer'){
            console.log("The ws : ",ws,"and the receiver ws :",receiverSocket);
            // if(ws!==receiverSocket) return;
            console.log("The Sdp i got from the receiver",message.sdp)
            senderSocket?.send(JSON.stringify({type:'answer',sdp:message.sdp}))
        }


    });
    ws.send('something');
    
})