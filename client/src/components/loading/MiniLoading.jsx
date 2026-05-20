import React from 'react'
import { PiSpinnerGapBold } from "react-icons/pi";

const MiniLoading = () => {
  return (
      <div className="flex justify-center items-center h-full w-full text-neutral-500">
          <PiSpinnerGapBold size={40} className="animate-spin" />
      </div>
  )
}

export default MiniLoading