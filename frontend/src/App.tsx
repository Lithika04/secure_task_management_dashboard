import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex min-h-screen items-center justify-center bg-blue-700'>
        <h1 className='text-4xl font-bold text-white'>Hello world- tailwind works</h1>
      </div>
    </>
  )
}

export default App
