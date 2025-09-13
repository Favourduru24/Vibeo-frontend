"use client"
import { useEffect } from 'react'
import { store } from '@/app/store'
import { userApiSlice } from '@/features/user/userApiSlice'



const Prefetch = ({children}) => {

    useEffect(() => {

        console.log('subscribing')
       const users = store.dispatch(userApiSlice.endpoints.getUser.initiate())

        return () => {
            console.log('unsubscribing')
            users.unsubscribe()
        }
    }, [])

    return <>{children}</>
     
}

export default Prefetch