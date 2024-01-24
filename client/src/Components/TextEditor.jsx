import React, { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import  "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];
  
function TextEditor() {
    const [socket,setsocket]=useState()
    const [quill,setquill]=useState()
    const {id} = useParams()
        useEffect(()=>{
            setInterval(() => {
                socket.emit('save-doc', quill.getContents())
            }, 1000);
        },[quill,socket])

      useEffect(()=>{
        const s = io("http://localhost:3000") 
        setsocket(s)
        return ()=>{
            s.disconnect()
        }
      },[])
      useEffect(()=>{
          if(socket == null || quill == null) return
        const handler = (delta)=>{
            quill.updateContents(delta)
        }
        socket.on('receive-changes',handler)

      },[quill,socket])

      useEffect(()=>{
          if(quill == null || socket == null) return 
        const handler = (delta,oldDelta,source)=>{
            if(source !== 'user') return
            socket.emit('send-changes',delta)
        }
        quill.on('text-change',handler)

      },[quill,socket])
      useEffect(()=>{
        if(socket == null || quill == null) return
        socket.once('load-doc',(data)=>{
            quill.enable()
            quill.setContents(data)
        })

        socket.emit('get-doc',id)
      },[socket,quill,id])

    const wrapperRef = useCallback((wrapper)=>{
        if(!wrapper)return
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q =  new Quill(editor,{
            theme : 'snow', modules :{ toolbar : toolbarOptions}})
            q.disable()
            q.setText("...Loading")
            setquill(q)
    },[])
  return (
    <div id='container' className='' ref={wrapperRef}></div>
  )
}

export default TextEditor