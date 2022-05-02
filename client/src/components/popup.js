import React, { useRef, useState } from 'react'

export default function Popup({show,title,msg}) {
    const [showPop,setShowPop] = useState(show)
    const popup = useRef()
    if (!showPop) {
        return <></>
    }

    
    setTimeout(()=>{

        popup.current.style.animation = "popup-out 0.5s ease forwards"
        setTimeout(() => {
            setShowPop(false)
        }, 500)
        
    },5000)
    function popOut(){
        popup.current.style.animation = "popup-out 0.5s ease forwards"
        setTimeout(() => {
            setShowPop(false)
        }, 500)
    }
  return(
    <div onClick={popOut} ref={popup} className='popup-card'>
        <h1 className='popup-title'>{title}</h1>
        <p className='popup-msg'>{msg}</p>
    </div>
  )
}
