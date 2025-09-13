"use client"

import { useSelector } from 'react-redux'
import {selectCurrentToken} from "../features/auth/authSlice"
import {jwtDecode} from  'jwt-decode'

 export const useAuth = () => {
    const token = useSelector(selectCurrentToken)
   
    
    if (token) {
        const decoded = jwtDecode(token)
        const  {username, email, id, profilePics} = decoded.UserInfo   

         
        return {username, email, id, profilePics}
    }

    return {username, email, id, profilePics}
}

export default useAuth

 