import React from 'react'
import "../index.css"
import Singnup from './Singnup.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<Singnup />} />

                <Route path='/login' element={<Login />} />

                <Route path='/home' element={<Home />} />

                {/* Added routes only */}
                <Route path='/profile' element={<Home />} />
                <Route path='/settings' element={<Home />} />
                <Route path='/about' element={<Home />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App;