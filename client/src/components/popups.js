import  ReactDOM  from 'react-dom'

export default function Popups({children}) {

  return ReactDOM.createPortal(
    <div className='popups-container'>
        {children}
    </div>
  , document.getElementById("portal"))

}
