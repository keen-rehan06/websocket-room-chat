import express from "express";
import {Server} from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
})

io.on("connection",(socket)=>{
    console.log("User Connected:",socket.id);
    socket.on("join-room",(roomId)=>{
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`)
    })
})
