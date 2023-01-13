import React from 'react'
import Image from 'next/image'
import { Web3Api } from '@web3uikit/icons'
import { Discord } from '@web3uikit/icons'

function Footer() {
  return (
    <footer className="bg-veryDarkBlue">
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

        {/* Social Links Container*/}
        <div className="flex justify-center space-x-4">
          {/* Link 1 */}
          
          <a href="https://grandida.com"> 
            <Discord fontSize="50px" color="#000000" title="Bell Icon" />
           </a>

        </div>
        </div>
      </div>

      {/* List container */}
      <div className="flex justify-around space-x-32">
        <div className="flex flex-col space-y-3 text-white">
          <a href="/" className='hover:text-brightRed'>Home</a>
          <a href="/addProperty" className='hover:text-brightRed'>My properties</a>
          <a href="/about" className='hover:text-brightRed'>About</a>
        </div>

      
      </div>

      {/* Input container */}
      <div className="flex flex-col justify-between">
        <form action="">
          <div className="flex space-x-3">
            <input type="text" placeholder='Send us a message' className="flex-1 px-4 rounded-full focus:outline-none" />
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