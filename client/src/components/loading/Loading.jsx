import React from 'react';
import { ImSpinner9 } from 'react-icons/im';

const Loading = () => {
  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-black/50 text-orange-500 z-50">
      <ImSpinner9 size={40} className="animate-spin" />
    </div>
  );
};

export default Loading;
