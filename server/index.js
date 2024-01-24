import {Server} from 'socket.io'
import mongoose from 'mongoose'
import Documents from './Document.js'

mongoose.connect('mongodb://localhost:27017/documents')
const defaultValue = ''
const io = new Server(3000,{
    cors:{
        origin : "http://localhost:5173",
        methods : ["GET","POST"],
    }
})

io.on('connection',(socket)=>{
    socket.on('get-doc',async(id)=>{
        socket.join(id)
        const document = await findOrCreateDocument(id)
        socket.emit('load-doc',document.data)
        socket.on('send-changes',(delta)=>{
            socket.broadcast.to(id).emit('receive-changes',delta)
        })
        socket.on('save-doc',async(data)=>{
            await Documents.findByIdAndUpdate(id,{data})
        })
    })
})

const findOrCreateDocument = async(id)=>{
    if(id == null) return
    const document = await Documents.findById(id)
    if(document) return document
    return await Documents.create({_id : id , data: defaultValue}) 
}

