import React from 'react'

export default function RecordingContainer({stopRecordingAndSend}) {
  return (
    <div onClick={stopRecordingAndSend} className="isRecording-container">
        <IoMicSharp className="isRecording-icon" />
    </div>
  )
}
