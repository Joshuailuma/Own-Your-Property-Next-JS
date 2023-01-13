import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ConnectButton } from "@web3uikit/web3"

function NavBar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <div className={navbar ? "mb-80" : "mb-24"}>
      <nav className="w-full  bg-brightRed fixed top-0 left-0 right-0 z-10">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              {/* LOGO */}
              <Link href="/">
              <Image src="/logo1.png" alt="Vercel Logo" width={100} height={25}/>
              </Link>
              {/* HAMBURGER BUTTON FOR MOBILE */}
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image src="/close.svg" width={30} height={30} alt="logo" />
                  ) : (
                    <Image
                      src="/hamburger-menu.svg"
                      width={30}
                      height={30}
                      alt="logo"
                      className="focus:border-none active:border-none"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center md:block md:pb-0 md:mt-0 ${
                navbar ? 'md:p-0 block' : 'hidden'
              }`}
            >
              <ul className="h-1/6 md:h-auto items-center justify-center md:flex ">
                <li className="pb-6 text-xl text-white py-2 md:px-6 text-center border-b-2 md:border-b-0  hover:bg-brightBlue  border-purple-900  md:hover:text-brightBlue md:hover:bg-transparent">
                  <Link href="/myProperties" onClick={() => setNavbar(!navbar)}>
                    My Properties
                  </Link>
                </li>
                <li className="pb-6 text-xl text-white py-2 px-6 text-center  border-b-2 md:border-b-0  hover:bg-brightBlue  border-purple-900  md:hover:text-brightBlue md:hover:bg-transparent">
                  <Link href="/about" onClick={() => setNavbar(!navbar)}>
                    About
                  </Link>
                </li>
                <li>
                  <div className="flex justify-center py-2">
                  <ConnectButton/>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
