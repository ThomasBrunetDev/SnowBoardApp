import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/authContext.jsx'
import { UserProvider } from './context/userContext.jsx'
import { AnimatePresence } from 'framer-motion'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AnimatePresence>
    <UserProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserProvider>
  </AnimatePresence>
)
