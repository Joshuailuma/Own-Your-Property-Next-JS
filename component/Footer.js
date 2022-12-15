import React from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

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
        <div className="flex justify-center space-x-4 mt-5">
          {/* Link 1 */}
          <a href="#"> <div></div> <Image src="/icon-facebook.svg" alt="facebook" className='h-8' width={30} height={0} /> </a>

          {/* Link 2 */}
          <a href="#"> <div></div> <Image src="/icon-instagram.svg" alt="facebook" className='h-8' width={30} height={0} /> </a>

          {/* Link 3 */}
          <a href="#"> <div></div> <Image src="/icon-twitter.svg" alt="facebook" className='h-8' width={30} height={0} /> </a>

          {/* Link 4 */}
          <a href="#"> <div></div> <Image src="/icon-youtube.svg" alt="facebook" className='h-8' width={30} height={0} /> </a>
      {/* Link 5 */}
      <a href="#"> <div></div> <Image src="/icon-pinterest.svg" alt="facebook" className='h-8' width={30} height={0} /> </a>
        </div>
        </div>
      </div>

      {/* List container */}
      <div className="flex justify-around space-x-32">
        <div className="flex flex-col space-y-3 text-white">
          <a href="#" className='hover:text-brightRed'>Home</a>
          <a href="#" className='hover:text-brightRed'>About</a>
          <a href="#" className='hover:text-brightRed'>Contact</a>
        </div>

        <div className="flex flex-col space-y-3 text-white">
          <a href="#" className='hover:text-brightRed'>Login</a>
          <a href="#" className='hover:text-brightRed'>Register</a>
          <a href="#" className='hover:text-brightRed'>Go now</a>
        </div>
      </div>

      {/* Input container */}
      <div className="flex flex-col justify-between">
        <form action="">
          <div className="flex space-x-3">
            <input type="text" placeholder='Update something' className="flex-1 px-4 rounded-full focus:outline-none" />
            <button className='px-6 py-2 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none'> 
            Go
            </button>
          </div>
        </form>
        <div className="hidden text-white md:block">
          Copyright &copy; 2022. All right reserved
        </div>
      </div>
    </div>
  </footer>

  )
}

export default Footer