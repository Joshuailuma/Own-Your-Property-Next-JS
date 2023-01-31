import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState} from 'react'
import { useNotification } from '@web3uikit/core';
import { Bell } from '@web3uikit/icons';
import axios from "axios";

function Footer() { 
   const [message, setMessage] = useState("")
   const dispatch = useNotification() //For notification
   const formRef = useRef() // To clear form data

   /**
    * When submit button is pressed
    * @param {event} e 
    */
   async function handleSubmit(e) {
    e.preventDefault();
    formRef.current.reset(); // Clear the form
    
    // Call the API
    let {status} = await axios.post("/api/contact", {
      message: message,
    })

    // If result from the API is 200 or successful
    if(status == "200"){
      // Send the success notification
      dispatch({
        type: "success",
        message: `Message successfully sent`,
        title: "Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    } else{
      // If the result is not success, send the error notification
       dispatch({
      type: "error",
      message: `Couldn't send message`,
      title: "Notification",
      position: "topR",
      icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
    })
    }
  }
  return (
    <footer className="bg-blue-800">
    {/* Flex container */}
    <div className="container flex flex-col-reverse justify-between px-6 py-10 mx-auto space-y-8 md:flex-row md:spacey-0">
      {/* Logo and social links container */}
      <div className="flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-0 md:items:start">

        <div className="mx-auto my-6 text-center text-white md:hidden">
        Copyright &copy; 2022. All right reserved
        </div>
        
        {/* Logo */}
        <div className='h-8'>
        <Image src="/logo1.png" alt="illustration-intro.svg" width={100} height={10} />
        </div>
      </div>

      {/* List container */}
      <div className="flex justify-around space-x-32">
        <div className="flex flex-col space-y-3 text-white">
          <Link href="/" className='hover:text-brightRed'>Home</Link>
          <Link href="/myProperties" className='hover:text-brightRed'>My properties</Link>
          <Link href="/about" className='hover:text-brightRed'>About</Link>
        </div>
      </div>

      {/* Input container */}
      <div className="flex flex-col justify-between">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="flex space-x-3">
            <input onChange={()=>{
              setMessage(event.target.value)
              }} required={true} type="text" placeholder='Send us a message' className="flex-1 px-4 rounded-full focus:outline-none" />
            <button className='px-6 py-2 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none'> 
            Send
            </button>
          </div>
        </form>
        <div className="hidden text-white md:block">
          Copyright &copy; Grandida LLC 2023. All rights reserved
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer