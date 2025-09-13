'use client'
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSignUpMutation } from "@/features/auth/authApiSlice"
import { useRouter } from "next/navigation"

     const SignUp = () => {
   const [signUpUser, {isLoading, isSuccess}] = useSignUpMutation()
   const router = useRouter()

   const [email, setEmail] = useState('')
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   useEffect(() => {
    if(isSuccess) {
      setEmail('')
      setPassword('')
      setUsername('') 
      router.push('/sign-in')
    }
   }, [isSuccess, router])

   

   const handleSignUp = async (e) => {
        e.preventDefault()
        await signUpUser({email, username, password})
        console.log({email, username, password})
   }

  return (
    <div className='flex flex-col h-[92vh] w-full pt-1 max-h-[92vh] gap-4'>
      <div className='w-full h-[35%] bg-gray-100 rounded-lg border-[0.8px] border-gray-400'>
         <Image src='/assets/ed-tech1.png' height={500} width={500} alt="sign/up" className="size-full rounded-lg"/>
      </div>
      <div className='w-full h-[65%] flex justify-center mx-auto mt-2 gap-4'>
         <div className="max-w-md h-[31rem] rounded-lg w-full bg-black-100 py-3 flex flex-col gap-4 justify-center border-[1px] border-gray-400 shadow-md shadow-border-100">
             <div className="px-3 flex flex-col gap-2">
                    <p className="text-xl text-white-100 font-sans font-semibold">Username</p>
                         <input type="text" className="outline-none w-full rounded-lg h-12 p-2 border-border-100 border-[0.1px] placeholder:text-white/50 text-[#f1f1f1] placeholder:text-[15px] m-0 transition-all duration-500 focus:ring-1 focus:ring-white/50 text-[15px] font-semibold" placeholder="John Doe" value={username} onChange={(e) => setUsername(e.target.value)}/>
                          </div>
             <div className="px-3 flex flex-col gap-2">
                    <p className="text-xl text-white-100 font-sans font-semibold">Email Address</p>
                         <input type="text" className="outline-none w-full rounded-lg h-12 p-2 border-border-100 border-[0.1px] placeholder:text-white/50 text-[#f1f1f1]  m-0 transition-all duration-500 focus:ring-1 focus:ring-white/50 text-[15px] font-semibold" placeholder="email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                          </div>
             <div className="px-3 flex flex-col gap-2">
                    <p className="text-xl text-white-100 font-sans font-semibold">Password</p>
                         <input type="text" className="outline-none w-full rounded-lg h-12 p-2 border-border-100 border-[0.1px] placeholder:text-white/50 text-[#f1f1f1] m-0 transition-all duration-500 focus:ring-1 focus:ring-white/50 text-[15px] font-semibold" placeholder="***gp*****8" value={password} onChange={(e) => setPassword(e.target.value)}/>
                          </div>
             <div className="px-3">
                          <button className="w-full h-11 rounded-md bg-white-100 text-black-100 font-semibold text-[18px] mt-2 cursor-pointer" onClick={handleSignUp} 
            >{isLoading ? '...' : 'SignUp'}
            </button>
                          <button className="w-full h-11 rounded-md bg-white-100 text-black-100 font-semibold text-[18px] mt-2 cursor-pointer" 
            >Google
            </button>
                          </div>
                          <div className="px-3">
                           <p className="text-white-100 text-[15px] font ">Already have an account <Link href='/sign-in'><span className="text-blue-500 cursor-pointer underline"> Sign-In </span></Link></p>                           
                          </div>
         </div>
        
      </div>
    </div>
  )
}

export default SignUp