import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './landing';
import { Game } from './screens/Game';

function App() {

  return (
    <>
      <div className='h-screen bg-slate-900'>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/game" element={<Game/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
