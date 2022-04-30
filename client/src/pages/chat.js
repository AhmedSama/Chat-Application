
import { useEffect, useState,useRef } from "react"
import { useHistory } from "react-router-dom";
import  {io} from "socket.io-client"
import msgSound from "../audio/pop-3.mp3"
import popupSound from "../audio/explosion2.mp3"
import {IoRocket,IoAttach,IoMicOutline,IoMicSharp} from "react-icons/io5"
import recordAudio from "../audio/audioRecorder";
import Popup from "../components/popup";
import Popups from "../components/popups";


function Chat(props){
    const socket = useRef()
    const his = useHistory()
    
    if(props.username === ""){
        his.replace("/")
    }

    const [msg,setMsg] = useState("")
    const [img,setImg] = useState("")
    const [popups,setPopups] = useState([])
    // put recorder inside useRef because in startRecording func i change the state so i have
    // to put it inside useRef so it does not change after the component re render
    let recorder = useRef();
    const [msgs,setMsgs] = useState([])
    const [isRecoring,setIsRecording] = useState(false)
    const username = props.username
    const [online,setOnline] = useState(0)
    const msgAudio = new Audio(msgSound)
    const popupAudio = new Audio(popupSound)
    function sendMsg(){
        if(msg === "" && img === "") return
        const data = {
            type : img ? "img" : "text",
            image : img,
            msg : msg,
            voice : "",
            username : username,
        }
        socket.current.emit("send_msg",data)

        // uncomment bellow if u use the node server 
        // setMsgs((list)=>[data,...list])
        setMsg("")
        setImg("")
    }
    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(base64data);
          }
        });
      }
    function sendAudioMsg(voiceBase64){
        const data = {
            type : "voice",
            image : "",
            msg : "",
            voice : voiceBase64,
            username : username,
        }
        socket.current.emit("send_voice",data)
    }
     
    const startRecording  = async () => {
        recorder.current = await recordAudio();
        recorder.current.start();
        setIsRecording(true)
    }
    const stopRecordingAndSend = async () => {
        const audio = await recorder.current.stop()
        const base64data = await getBase64FromUrl(audio.audioUrl)
        // send audio msg
        sendAudioMsg(base64data)
        setIsRecording(false)
    }
    function makeSrc(element,url){
        element.src = url
    }
    function makeMsg(msgData,key){
        if(msgData.type === "text"){
            return (
            <div key={key} id={username===msgData.username ? "me" : "other"} className="msg_body" >
                <div className="username">{msgData.username}</div>
                <div className="msg" >{msgData.msg}</div>
            </div>
            )
        }
        else if(msgData.type === "img"){
            return(
                <div key={key} id={username === msgData.username ? "me" : "other"} className="msg_body img">
                    <div className="username">{msgData.username}</div>
                    <div className="img-container">
                        <img src={msgData.image} /> 
                    </div>
                </div>
            )
        }
        else if(msgData.type === "voice"){
            return(
                <div onClick={(e)=>makeSrc(e.target.lastChild,e.target.dataset.url)} data-url={msgData.voice} key={key} id={username === msgData.username ? "me" : "other"} className="msg_body voice">
                    <div className="username">{msgData.username}</div>
                    <audio src="null" controls />
                </div>
            )
        }
    }
        const makeImage = async (event) => {
            const url = await getBase64FromUrl(URL.createObjectURL(event.target.files[0]))
            setImg(url)
        }
        useEffect(()=>{
            // make the port 3001 if u use node server and 5000 with python
            socket.current = io.connect("http://localhost:3001") 
            socket.current.emit("new_user",username)
            socket.current.on("recv_msg",(data)=>{
                // made the .msgs div become flex-direction : column-reverse
                // so i put the last msg at the first of the msgs array
                setMsgs((list)=>[data,...list])
                
                msgAudio.currentTime = 0
                msgAudio.play()
            })
            socket.current.on("count",(data)=>{
                setOnline(data)
            }) 
            socket.current.on("recv_voice",(data)=>{
                console.log(data.voice)
                setMsgs((list)=>[data,...list])
                msgAudio.currentTime = 0
                msgAudio.play()
            }) 

            socket.current.on("popup",(data)=>{
                popupAudio.currentTime = 0
                popupAudio.play()
                setPopups((prevPopups)=>{
                    //data expected to be = {show : true,title:data.title,body : data.body}
                    return [...prevPopups,data]
                })
                
                
            })

        },[])
    return(
        <>
        <div className="container">
            <div className="title flex">
                <div className="greendot"></div>
                {online} online
                {online === 1 && <div className="small">(only you in the chat)</div>}
                </div>
            <div className="form">
                <div className="msgs">
                    {msgs.map((oneMsg, key)=>{
                        return makeMsg(oneMsg,key)
                    })}
                    
                </div>
                {isRecoring ? (
                    <div onClick={stopRecordingAndSend} className="isRecording-container">
                         <IoMicSharp className="isRecording-icon" />
                    </div>
                    
                ) : (<div className="inputs">
                    {img ? 
                    <div className="img-container">
                        <img src={img} /> 
                    </div>
                    : <input onKeyDown={(e)=>{
                        if(e.key === "Enter"){sendMsg()}
                    }} placeholder="message..." value={msg} className="input" onChange={(e)=>setMsg(e.target.value)}/>}
                    <button className="btn" onClick={sendMsg}>
                    <IoRocket className="sendIcon"/>
                    </button>
                    <label className="file-btn">
                        <input type="file" onChange={makeImage}/>
                        <IoAttach className="attachIcon" />
                    </label>
                    <div onClick={startRecording} className="record-btn"><IoMicOutline className="record-icon"/></div>
                </div>
                )}
                
                
            </div>
        </div>

        {
            popups.length > 0 && (
                <Popups>
                    {popups.map((popup,key)=>{
                        return <Popup key={key} show={true} title={popup.title} msg={popup.body} /> 
                    })}
                </Popups>
            ) 
        }
        </>
    )
}

export default Chat








