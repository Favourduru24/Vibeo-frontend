'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLoginMutation } from "@/features/auth/authApiSlice"
import { setCredentials } from "@/features/auth/authSlice"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginUser, {isLoading, isSuccess, isError, error}] = useLoginMutation()
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()
 
  useEffect(() => {
    if(isSuccess) {
       setEmail('')
       setPassword('')
       router.push('/')
    }
  }, [isSuccess, router])
 

   const handleSignIn = async (e) => {
      e.preventDefault()
      try {
        const {accessToken} = await loginUser({email, password}).unwrap()
        dispatch(setCredentials({accessToken}))
      } catch(err) {
         if(!err?.status) {
           setErrMsg('No server response!')
         } else if(err?.status === 400) {
           setErrMsg('All field are required!')
         }else if(err?.status === 401) {
           setErrMsg('UnAuthorized')
         } else if(isError) {
           setErrMsg(error?.data?.message)
         } else {
           setErrMsg(err?.data?.message)
         }
      }
   }

  return (
    <div className='flex flex-col h-[92vh] w-full pt-1 max-h-[92vh] gap-6'>
      <div className='w-full h-[35%] bg-gray-100 rounded-lg border-[0.8px] border-gray-400'>
         <Image src='/assets/ed-tech1.png' height={500} width={500} alt="sign/up" className="size-full rounded-lg"/>
      </div>
      <div className='w-full h-[65%] flex justify-center mx-auto mt-2 gap-4'>
         <div className="max-w-md h-[25rem] rounded-lg w-full bg-black-100 py-3 flex flex-col gap-4 justify-center border-[1px] border-gray-400 shadow-md shadow-border-100">
             <div className="px-3 flex flex-col gap-2">
                    <p className="text-xl text-white-100 font-sans font-semibold">Email Address</p>
                         <input type="text" className="outline-none w-full rounded-lg h-12 p-2 border-border-100 border-[0.1px] placeholder:text-white/50 text-[#f1f1f1]  m-0 transition-all duration-500 focus:ring-1 focus:ring-white/50 text-[15px] font-semibold" placeholder="email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                          </div>
             <div className="px-3 flex flex-col gap-2">
                    <p className="text-xl text-white-100 font-sans font-semibold">Password</p>
                         <input type="text" className="outline-none w-full rounded-lg h-12 p-2 border-border-100 border-[0.1px] placeholder:text-white/50 text-[#f1f1f1] m-0 transition-all duration-500 focus:ring-1 focus:ring-white/50 text-[15px] font-semibold" placeholder="***gp*****8" value={password} onChange={(e) => setPassword(e.target.value)}/>
                          </div>
             <div className="px-3">
                          <button className="w-full h-11 rounded-md bg-white-100 text-black-100 font-semibold text-[18px] mt-2 cursor-pointer" onClick={handleSignIn}
            >{isLoading ? '...' : 'SignIn'}
            </button>
                          <button className="w-full h-11 rounded-md bg-white-100 text-black-100 font-semibold text-[18px] mt-2 cursor-pointer" 
            >Google
            </button>
                  <p className="text-destructive-500">{errMsg ? errMsg : ''}</p>
                          </div>
                          <div className="px-3">
                           <p className="text-white text-[15px] font">Don't have an account <Link href='/sign-up'><span className="text-blue-500 cursor-pointer underline">Sign-up</span></Link></p>                           
                          </div>
         </div>
        
      </div>
    </div>
  )
}

export default SignIn