import React from 'react'
import Image from 'next/image'
import { Accordion } from '@web3uikit/core'    //icons
import Footer from '../components/Footer'
import NavBar from '../components/NavBar';
import Link from 'next/link';


const About = () => {
  return (
    <div>
      <NavBar/>
      <section id='hero'>
        {/* Flex row makes it responsive */}
        <container className="flex flex-col-reverse md:flex-row items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0">
          {/* Left item */}
          <div className='flex flex-col mb-32 space-y-12 md:w-1/2'>
            <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">
              About Us
            </h1>
            <p className="max-w-lg text-center md:text-left text-textColorWrite text-2xl">
            Own Your Property makes you confident and secured with everything you have. 
            Your land, property, house, electronic devices such as Phones, Laptops, Computers could be stored
            on the Blockchain and identified as yours by the public.
            </p>
            <div className="flex justify-center md:justify-start">
            <Link
              href="/myProperties"
              className="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
              >Get Started</Link>
          </div>
          </div>

          {/* Image item */}
          <div className='mid:w-1/2'>

          <Image src="/home.jpeg" alt="illustration-intro.svg" width={580} height={525} />
          </div>
        </container>

        <Accordion
    id="accordion"
      isExpanded
    title="How to store a Property"
    className="md:w-fit mb-7 ml-4"
>
  <ol className={"mx-9 list-decimal subpixel-antialiased font-semibold"}>
  <li> Connect your Wallet</li>
  <li> Navigate to My-Properties page</li>
  <li> Click Add New</li>
  <li> Fill in the property details</li>
  <li> Upload an Image</li>
  <li> Upload details</li>
  <li> Upload to blockchain</li>
  </ol>

</Accordion>
      </section>
      <Footer/>
    </div>
  )
}

export default About