import React from 'react'

export default function Msgs({msgs,username}) {
    // render the msg depending on the type of msg
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
                <div key={key} id={username === msgData.username ? "me" : "other"} className="msg_body voice">
                    <div className="username">{msgData.username}</div>
                    <audio src={msgData.voice} controls />
                </div>
            )
        }
    }
  return (
    <div className="msgs">
        {msgs.map((oneMsg, key)=>{
            return makeMsg(oneMsg,key)
        })}
        
    </div>
  )
}
