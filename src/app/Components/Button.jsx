"use client"
import { useRouter } from 'next/navigation'
import React from 'react'


const Button = () => {
    const Route = useRouter();
    return (
        <div>
            <button onClick={() => Route.push("/know-more")} className='py-1 px-2 bg-slate-900 text-slate-400 rounded hover:bg-slate-950 cursor-pointer'>Know More </button>
        </div>
    )
}

export default Button