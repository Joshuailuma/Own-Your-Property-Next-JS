import NavBar from '../components/NavBar';
import Image from 'next/image'
import Link from 'next/link';


export default function Home() {
  return (
    <div>
      <NavBar />
      
      {/* Hero section */}
      <section id='hero'>
        {/* Flex row makes it responsive */}
        <div className="flex flex-col md:flex-row items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0">
          {/* Left item */}
          <div className='flex flex-col mb-32 space-y-12 md:w-1/2'>
            <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">
              Store your property on the blockchain
            </h1>
            <p className="max-w-sm text-2xl text-center md:text-left text-textColorWrite">
            Own Your Property stores your property on the Blockchain
             and allows the public verify that you are the owner of your property during sale or transfer.
            </p>
            <div className="flex justify-center md:justify-start">
            <Link href="/myProperties"
              className="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
              >Get Started</Link>
          </div>
          </div>

          {/* Image item */}
          <div className='mid:w-1/2'>

          <Image className='rounded' src="/my_stuff.png" alt="illustration-intro.svg" width={580} height={525} />

          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features">
        {/* space mean space between the items */}
        <div className="container flex flex-col px-4 mx-auto mt-10 space-y-12 md:space-y-0 md:flex-row">
          {/* 1st flex item  flex flex-col space-y-12 makes this div be a container*/}
          <div className="flex flex-col space-y-12 md:w-1/2">
          <h2 className="max-w-md text-4xl font-bold text-center md:text-left">
            What&apos;s different about Own Your Property?
          </h2>
          <p className="max-w-sm text-2xl text-center text-textColorWrite md:text-left">
          OYP allows the public to verify if a property is authentic
          </p>
          </div>

          {/*2nd flext item= Numbered list */}
          <div className='flex flex-col space-y-8 md:w-1/2'>
            {/* List item 1 */}

          <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">

          <div className="rounded-l-full bg-brightRedSupLight md:bg-transparent">
            <div className="flex items-center space-x-2">
              <div className="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed">
                01
              </div>
              <h3 className="text-base font-bold md:hidden">
               Store your property forever
              </h3>
            </div>
          </div>

          <div>
            <h3 className='hidden mb-4 text-lg font-bold md:block'>
            Store your property forever
            </h3>
            <p>See how your day-to-day tasks fit into the wider vision. Go from
              tracking progress at the milestone level all the way down to the
                smallest of details. Never lose sight of the bigger picture
                again.</p>
          </div>            
          </div>

               {/* List item 2 */}

               <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">

<div className="rounded-l-full bg-brightRedSupLight md:bg-transparent">
  <div className="flex items-center space-x-2">
    <div className="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed">
      02
    </div>
    <h3 className="text-base font-bold md:hidden">
      Transfer your property safely
    </h3>
  </div>
</div>

<div>
  <h3 className='hidden mb-4 text-lg font-bold md:block'>
  Transfer your property safely
  </h3>
  <p>See how your day-to-day tasks fit into the wider vision. Go from
    tracking progress at the milestone level all the way down to the
      smallest of details. Never lose sight of the bigger picture
      again.</p>
</div>
  
</div>

     {/* List item 3 */}

     <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row">

<div className="rounded-l-full bg-brightRedSupLight md:bg-transparent">
  <div className="flex items-center space-x-2">
    <div className="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed">
      03
    </div>
    <h3 className="text-base font-bold md:hidden">
      Verify people&apos;s property before buying
    </h3>
  </div>
</div>

<div>
  <h3 className='hidden mb-4 text-lg font-bold md:block'>
   Verify people&apos;s property before buying
  </h3>
  <p>See how your day-to-day tasks fit into the wider vision. Go from
    tracking progress at the milestone level all the way down to the
      smallest of details. Never lose sight of the bigger picture
      again.</p>
</div>
  
</div>
</div>

        </div>
      </section>

      {/* Testimonials */}

      <section id="testimonials">
        {/*Container to hold Heading and testemonial block*/}
        <div className="max-w-6xl px-5 mx-auto mt-24 text-center mb-7">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-center">
            Here is what users have to say
          </h2>

        {/* Testimonial. Flex is like flexbox */}
        <div className="flex flex-col mt-5 md:flex-row md:space-x-6">
          {/* Testimonial 1. For medium screen we will take 1-third of each testimonial */}
          <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:flex md:w-1/3">
          {/* Image div */}
          <div className="mt-7 w-16">
          <Image src="/avatar-anisha.png" alt="illustration-intro.svg" width={100} height={10} />
          </div>
          <h5 className="text-lg font-bold"> Park Jin Sun</h5>
          <p className="text-sm text-darkGrayishBlue">
          I started having more sales after listing my properties on this platform
          </p>
          </div>

        {/* Testimonial 2. For medium screen we will take 1-third of each testimonial */}
        <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3">
          {/* Image div */}
          <div className="mt-7 w-16">
          <Image src="/avatar-ali.png" alt="illustration-intro.svg" width={100} height={10} />
          </div>
          <h5 className="text-lg font-bold"> Annabel Grass</h5>
          <p className="text-sm text-darkGrayishBlue">
          People easily trusted and were convinced about being the owner of my stuff.
          </p>
          </div>



          {/* Testimonial 3. For medium screen we will take 1-third of each testimonial */}
          <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3">
          {/* Image div */}
          <div className="mt-7 w-16">
          <Image src="/avatar-richard.png" alt="illustration-intro.svg" width={100} height={10} />
          </div>
          <h5 className="text-lg font-bold"> Issac Watts</h5>
          <p className="text-sm text-darkGrayishBlue">
          This is the solution to buying stolen or illegal properties unknowningly.
          </p>
          </div>
        </div>        
        </div>
      </section>

      {/* Call to action */}
      <section id="cta" className='bg-brightRed'>
        {/* Flex container */}
        <div className="container flex flex-col items-center justify-center px-6 py-16 mx-auto space-y-12 md:py-12 md:space-y-0">
          <h2 className='text-4xl font-bold text-center text-white md:text-4xl md:max-w-xl'>
            Try us today. It is fully decentralized.
          </h2>
        </div>
      </section>


    </div>
  );
}
