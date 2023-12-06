'use client';
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

const PatientTextField = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <input
      {...props}
      className="bg-white border-solid border border-[#E1E1E1] cursor-text block w-full rounded-lg py-1.5 pl-4 pr-4 h-12 text-sm 
      text-black  placeholder:text-gray-400 focus:border-[#1ABCB7] focus:outline-none focus:border-2"
    />
  );
};

export default PatientTextField;
