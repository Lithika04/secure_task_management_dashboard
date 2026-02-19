import AnimatedBackdrop from './components/UI/AnimatedBackdrop';
import Modal from './components/UI/Modal';
import { useState } from 'react'

import './App.css'
import { main } from 'framer-motion/client';

function App() {
  const [open, setOpen] = useState(false)

  return (
    <main className='relative min-h-screen bg-slate-950'>
      <AnimatedBackdrop variant='dark'/>
      <div className='relative flex min-h-screen items-center justify-center'>
        <button
            onClick={() => setOpen(true)}
            className='rounded-md bg-blue-600 px-4 py-2 text-white'>
              OPen Modal
            </button>
      </div>
      <Modal isOpen={open} title="Test Modal" onClose={() => setOpen(false)}>
        <p className="text-slate-700">Modal content works!</p>
      </Modal>
    
    </main>
  )
}

export default App
