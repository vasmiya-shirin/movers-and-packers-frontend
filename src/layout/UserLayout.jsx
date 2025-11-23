import React from 'react'
import Header from '../components/user/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/user/Footer'

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <div className="flex-grow">
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default UserLayout
