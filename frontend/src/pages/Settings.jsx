import React from 'react'
import { ToastContainer } from 'react-toastify'

export default function Settings() {
  return (
    <>
    <div>Settings</div>
    <ToastContainer
    position="bottom-right"
    autoClose="2000"
    bodyClassName={() => "text-foreground"}
    draggable
  />
    </>
  )
}
