import React from 'react'

export default function Online({online}) {
  return (
    <div className="title flex">
        <div className="greendot"></div>
        {online} online
        {online === 1 && <div className="small">(only you in the chat)</div>}
    </div>
  )
}
