import React from "react"
import TextEditor from "./Components/TextEditor"
import {
  Route,
  BrowserRouter as Router,
  Routes,Navigate
} from 'react-router-dom'

import { v4 as uuid } from "uuid"


function App() {

  return (
   <Router>
    <Routes>
    <Route path="/" element = {<Navigate to={`/documents/${uuid()}`}/>}/>    
    <Route path='/documents/:id' element={<TextEditor/>}/>
    </Routes>
   </Router>
  )
}

export default App
