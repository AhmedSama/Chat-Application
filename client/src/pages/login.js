import { useState } from "react"
import { useHistory } from "react-router-dom"

function Login(props){
    
    const his = useHistory()
    const [name,setName] = useState("")

   function connect(){
       if(name === "") return 
        props.setUser(name)
        his.replace("/chat")
   }
   
    return(
        <div className="container">
            <div className="form">
                <h1 className="title">Choose a username</h1>
                <input className="input" placeholder="username ..." onChange={(e)=>setName(e.target.value)}/>
                <button className="btn" onClick={connect}>Connect</button>
            </div>
        </div>
    )
}

export default Login

