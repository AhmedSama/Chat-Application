import { useState } from "react";
import {BrowserRouter,Route,Switch} from "react-router-dom"
import Chat from "./pages/chat";
import Login from "./pages/login";


function App() {
  const [username,setUsername] = useState("")
  return (
    <div>
      <h1 className="nav">CHAT APPLICATION</h1>
      <BrowserRouter>
        <Switch>
          <Route path={"/"} exact>
            <Login setUser = {setUsername}/>
          </Route>

          <Route path={"/chat"} exact>
            <Chat username = {username}/>
          </Route>
        </Switch>
      </BrowserRouter>  
    </div>
  );
}

export default App;
