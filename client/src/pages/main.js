import { useState } from "react";
import { Link } from "react-router-dom"
import recordAudio from "../audio/audioRecorder";



function Main (){
    const [audioURL,setAudiURL] = useState("")
    let recorder = null;
    console.log(recorder) 
    const startRecording  = async () => {
        recorder = await recordAudio();
        recorder.start();
    }
    const stopRecording = async () => {
        const audio = await recorder.stop()
        let base64data = await getBase64FromUrl(audio.audioUrl)
        base64data = base64data.replace("text/plain",Math.random().toString())
        setAudiURL(base64data)
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
      function delAudio(){
        setAudiURL("")
      }
    return (
        // data:audio/mp3;base64,
        // data:image/png;base64,
        <div>
            <Link to={"/login"}>Login</Link>
            {audioURL && 
                <audio controls >
                        <source src={audioURL} type="audio/mpeg" />
                </audio>
            }            
            <button onClick={startRecording}>record</button>
            <button onClick={stopRecording}>stop</button>
            <button onClick={delAudio}>clear</button>
            <audio src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-35448/zapsplat_cartoon_bubble_pop_007_40279.mp3" controls>
            </audio>
        </div>
    )
}

export default Main

