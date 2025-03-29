import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import OrderCreationScreen from './screens/OrderCreationScreen'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/create-order" element={<OrderCreationScreen />} />
      </Routes>
    </div>
  )
}

export default App
