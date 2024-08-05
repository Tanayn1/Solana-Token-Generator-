import React from 'react'

interface Input {
 placeholder?: string,
 name: string,
 onChange: Function
}

export default function Input({ name, placeholder, onChange } : Input) {
  return (
    <div className=' mx-2 '>
        <h1 className=' text-sm font-semibold mb-2'>{name}</h1>
        <div className=' bg-zinc-900 rounded-xl '>
            <input type="text" placeholder={placeholder} onChange={(e)=>{onChange(e)}}  className=' bg-zinc-900 focus:outline-none m-3  placeholder:text-sm' />
        </div>
    </div>
  ) 
}
