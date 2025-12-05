import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import ChatBot from '../components/ChatBot'

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <div className="flex-grow">
            <Outlet />
        </div>
        <ChatBot />
        <Footer />
    </div>
  )
}

export default UserLayout
