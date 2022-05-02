
import { useEffect, useState,useRef } from "react"
import { useHistory } from "react-router-dom";
import  {io} from "socket.io-client"
import msgSound from "../audio/pop-3.mp3"
import popupSound from "../audio/long.wav"
import recordAudio from "../audio/audioRecorder";
import Popup from "../components/popup";
import Popups from "../components/popups";
import Online from "../components/online";
import Msgs from "../components/msgs";
import Inputs from "../components/inputs";
import RecordingContainer from "../components/recordingContainer";
import Form from "../components/form";
import Container from "../components/container";
import getBase64FromUrl from "../utility/getBase64FromUrl";


const server = "https://blooming-sands-55600.herokuapp.com"

function Chat(props){
    // put socket inside useRef() so it won't change when the component re-render when some state changes
    const socket = useRef()
    // to navigate to login when there is no username
    const his = useHistory()
    if(props.username === "" || props.username === undefined){
        his.replace("/")
    }

    const [msg,setMsg] = useState("")
    const [img,setImg] = useState("")
    const [popups,setPopups] = useState([])
    // put recorder inside useRef because in startRecording func i change the state so i have
    // to put it inside useRef so it does not change after the component re-render
    let recorder = useRef();
    const [msgs,setMsgs] = useState([])
    const [isRecoring,setIsRecording] = useState(false)
    const username = props.username
    const [online,setOnline] = useState(0)
    const msgAudio = useRef()
    const popupAudio = useRef()
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
        setMsg("")
        setImg("")
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

    
        const makeImage = async (event) => {
            const url = await getBase64FromUrl(URL.createObjectURL(event.target.files[0]))
            setImg(url)
        }

        // LISTENERS
        useEffect(()=>{
            socket.current = io(server) 
            socket.current.emit("new_user",username)

            socket.current.on("recv_msg",(data)=>{
                // made the .msgs div become flex-direction : column-reverse
                // so i put the last msg at the first of the msgs array
                setMsgs((list)=>[data,...list])
                
                msgAudio.current.play()
            })
            socket.current.on("count",(data)=>{
                setOnline(data)
            }) 
            socket.current.on("recv_voice",(data)=>{
                console.log(data.voice)
                setMsgs((list)=>[data,...list])
                msgAudio.current.play()
            }) 

            socket.current.on("popup",(data)=>{
                popupAudio.current.play()
                setPopups((prevPopups)=>{
                    //data expected to be = {show : true,title:data.title,body : data.body}
                    return [...prevPopups,data]
                })
                
                
            })

        },[])
    return(
        <>
        <audio ref={popupAudio} src={popupSound} />
        <audio ref={msgAudio} src={msgSound} />
        <Container>
            <Online online={online} />
            <Form>
                <Msgs msgs={msgs} />
                {isRecoring ? ( 
                    <RecordingContainer stopRecordingAndSend={stopRecordingAndSend} />
                ) : 
                    <Inputs 
                        img={img}
                        msg={msg}
                        setMsg={setMsg}
                        sendMsg={sendMsg}
                        setImg={setImg}
                        startRecording={startRecording}
                        makeImage={makeImage}
                    />
                } 
            </Form>
        </Container>
            
        {
            // popups
            popups.length > 0 && (
                <Popups>
                    {popups.map((popup,key)=>{
                        if(popup !== null || popup !== undefined)
                            return <Popup key={key} show={true} title={popup.title} msg={popup.body} /> 
                    })}
                </Popups>
            ) 
        }
        </>
    )
}

export default Chat








