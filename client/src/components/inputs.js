import React from 'react'
import { IoAttach, IoRocket,IoMicOutline } from 'react-icons/io5'

export default function Inputs({img,msg,setMsg,sendMsg,makeImage,startRecording}) {
  return (
     <div className="inputs">
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

  )
}
