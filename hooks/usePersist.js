 'use client'
import { useState, useEffect } from 'react'

const usePersist = () => {
  const [persist, setPersist] = useState(true)

  useEffect(() => {
   const stored = localStorage.getItem('persist')
  //  console.log("Stored persist value from localStorage:", stored)
   if (stored !== null) {
     setPersist(JSON.parse(stored))
   }
 }, [])
 
 useEffect(() => {
  //  console.log("Persist value changed:", persist)
   localStorage.setItem('persist', JSON.stringify(persist))
 }, [persist])

  return [persist, setPersist]
}

export default usePersist