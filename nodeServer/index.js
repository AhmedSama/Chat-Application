const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")
const Path = require("./utility")
const fs = require("fs")

app.use(cors())
app.use(express.static('public'))

const server = http.createServer(app)

const io = new Server(server, {
    cors : {
        origin : "*",
        methods : "*"
    }
})

// Util Functions //////////////////////

const saveAudioFile = (buffData) => {
    let fileUrl = "/audio/audio" + Math.floor(Math.random()*1000000 + 100) 
    fs.writeFileSync(__dirname + "/public/"+fileUrl + ".mp3",buffData)
    return "http://localhost:3001" + fileUrl + ".mp3"
}

const changeFromBase64ToBinary = (base64Data) => {
    const buff = Buffer.from(base64Data,"base64")
    return buff
}

// /////////////////////

let online = 0

io.on("connection",socket=>{
    console.log("user connected with id = " + socket.id)
    online++
    io.emit("count",online)
    socket.on("send_msg",data=>{
        io.emit("recv_msg",data)
    })
    socket.on("send_voice",(data)=>{
        const audioBase64 = data.voice.split(",")[1]
        const binaryData = changeFromBase64ToBinary(audioBase64)
        data.voice = saveAudioFile(binaryData)
        io.emit("recv_voice",data)
    })
    socket.on("new_user",(data)=>{
        socket.username = data
        console.log(socket.username)
        const popup  = {
            title : "User Enter chat",
            body : `${data} is connected to the chat say hi to him/her :)`
        }
        io.emit("popup",popup)
    })
    socket.on("disconnect",()=>{
        console.log(socket.username + " is disconnected!")
        online--
        io.emit("count",online)
        const popup  = {
            title : "User Leave chat",
            body : `${socket.username} is disconnected :(`
        }
        io.emit("popup",popup)
    })
})


server.listen(3001,()=>{
    console.log("Server is running on port = 3001 ...")
})























