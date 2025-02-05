import React from 'react'
import { FaSpinner } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";

const Loading = () => {
  return (
    <div className='flex justify-center items-center w-full h-full text-orange-500'>
          <ImSpinner9 size={40} className='animate-spin' />
    </div>
  )
}

export default Loading