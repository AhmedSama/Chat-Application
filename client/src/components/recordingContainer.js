import React from 'react'
import { IoMicSharp } from 'react-icons/io5'

export default function RecordingContainer({stopRecordingAndSend}) {
  return (
    <div onClick={stopRecordingAndSend} className="isRecording-container">
        <IoMicSharp className="isRecording-icon" />
    </div>
  )
}
