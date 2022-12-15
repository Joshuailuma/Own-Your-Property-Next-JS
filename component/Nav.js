import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useRef } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import {ConnectButton} from "@web3uikit/web3"

//We shall eventually bring this to our layout since we want it to be on every page
const Nav = () => {
  const myRef = useRef()
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()

   
  // useEffect(()=>{
  //   myRef.current.classList.toggle(styles.open) // and more..
  // })
let i = false

  const btnToggle = () => {
    console.log('HI');
    setShowNav(!showNav)
    myRef.current.classList.toggle(styles.open)
    
    // myRef.current.classList.toggle(styles.flex)
    // myRef.current.classList.toggle(styles.hidden)
    // console.log('Hahah');
    console.log(i);
  };

  const navToggleFlex = () => {
    myRef.current.classList.toggle(styles.flex)
  };

  const navToggleHidden = () => {
    myRef.current.classList.toggle(styles.hidden)
  };

  
  if (session){
    return (
    <nav className="relative container mx-auto p-6">
        {/* Flex Container */}
        <div className="flex item-center justify-between">
          {/* Logo */}
          <div className="pt-2">
        <Link href="./"> <Image src="/logo1.png" alt="Vercel Logo" width={100} height={25} /></Link>  
          </div>

          {/* Menu Items */}
          <div class="hidden md:flex md:space-x-6">
            <Link className="hover:text-brightRed" href="/">Home</Link> 
            <Link class='hover:text-darkGrayishBlue' href="/products">My Properties</Link>
            <button class='hover:text-darkGrayishBlue' onClick={signOut}>Logout</button>
            <Link class='hover:text-darkGrayishBlue' href="/about">About</Link>
            </div>
        {/* Button */}
        {/* <Link href="#" class="hidden md:block  p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight "
          >Get Started</Link> */}

       <ConnectButton/>
         

          {/* Hamburger icon*/}
          <div onClick={btnToggle} ref={myRef}>
          <button id="menu-btn" 
          className="block hamburger focus:outline-none md:hidden">
          <span className={styles.hamburgerTop}></span>
          <span className={styles.hamburgerMiddle}></span>
          <span className={styles.hamburgerBottom}></span>
        </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div class="md:hidden">
        <div
          id="menu" className={ showNav ? "absolute flex flex-col  items-center self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md" : "absolute flex-col items-center hidden self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"  }
          class="absolute flex-col  items-center hidden self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md">
          <Link href="/">Home</Link>
          <Link href="/api/logout">Logout</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
      </nav>
    )
  } else{
// console.log("CLient User not here");
  return (
    <nav className="relative container mx-auto p-6">
           {/* Flex Container */}
           <div className="flex item-center justify-between">
             {/* Logo */}
             <div className="pt-2">
           <Link href="./"> <Image src="/logo1.png" alt="Vercel Logo" width={150} height={25} /></Link>  
             </div>
   
             {/* Menu Items */}
             <div class="hidden md:flex md:space-x-6">
               <Link className="hover:text-brightRed" href="/">Home</Link> 
               <Link class="hover:text-darkGrayishBlue" href={"/products"}>My Properties</Link>
               <Link class='hover:text-darkGrayishBlue' href="/about">About</Link>
               </div>
           {/* Button */}

            
            <ConnectButton/>

   
             {/* Hamburger icon*/}
             <div onClick={btnToggle} ref={myRef}>
             <button id="menu-btn" 
             className="block hamburger focus:outline-none md:hidden">
             <span className={styles.hamburgerTop}></span>
             <span className={styles.hamburgerMiddle}></span>
             <span className={styles.hamburgerBottom}></span>
           </button>
             </div>
           </div>
   
           {/* Mobile menu */}
           <div class="md:hidden">
           <div
             id="menu" className={ showNav ? "absolute flex flex-col  items-center self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md" : "absolute flex-col items-center hidden self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"  }
             class="absolute flex-col  items-center hidden self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md">
             <Link href="/">Home</Link>
             <button onClick={signIn}>Login</button>
             <Link href="/about">About</Link>
           </div>
         </div>
         </nav>
  )
  }
    
       
  
}

export default Nav