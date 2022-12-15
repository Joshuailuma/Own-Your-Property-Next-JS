import Footer from "../component/Footer"
import { useUser } from '@auth0/nextjs-auth0';


const login = () => {
  const {user, error, isLoading}  = useUser()

  

    return (
      <div>
        <section className="flex flex-col mt-12 mx-20">
        <h1 className="text-4xl font-bold md:text-5xl"> Welcome</h1>
        <p className="text-2xl mt-6 text-darkGrayishBlue">
          Please enter your details to <span className="font-bold" >Login</span> 
            </p>     

        
            <form action="" className="mt-6">
              <div className=" flex flex-col space-y-6">             
             {/* Email */}

              <label htmlFor="" className="text-left">Email</label>
              <input
                type='email'
                class="px-6 py-3 align-middle rounded-lg border-solid outline-double	w-80"
                placeholder="Enter your email"
              />



            {/* Password */}

          <label htmlFor="" className="text-left">Password</label>
              <input
                type='password'
                class="px-6 py-3 rounded-lg border-solid outline-double	w-80"
                placeholder="Enter your password"
              />
              </div>
              <input type="submit" value="Submit" className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none" />
            </form>
            
        </section>

        <Footer/>
      </div>
    )
  }
  
  export default login