import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState()


  useEffect(() => {
    fetch('http://localhost:8000/hello').then(res => res.json()).then(data => {
      setMessage(data.Hello);
    })
  }, [])

  return (
    <>
      <h1>Vite + React</h1>
      {message}
    </>
  )
}

export default App
