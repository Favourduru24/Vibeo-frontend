'use client'
import { useState, useEffect, useRef } from 'react'

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  className = '',
  overflow,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div 
      ref={selectRef}
      className={`relative w-full ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 text-left bg-[#1F2225] border-[1.0px] border-[#4B4D4F] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-white/50 h-15 w-full"
      >
        <span>{value || placeholder}</span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className={`${overflow ? '-top-0' : ''} absolute z-10 w-full mt-1 bg-black-100 border-[0.3px] border-[#4B4D4F] rounded-md shadow-lg`}>
          <ul className="py-1 overflow-auto text-base focus:outline-none max-h-[10rem]">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2 cursor-pointer hover:bg-[#4B4D4F] ${
                  value === option.value ? 'bg-black/40 text-white-100' : ''
                }`}
              >
                {option.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CustomSelect