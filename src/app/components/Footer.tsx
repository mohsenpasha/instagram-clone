'use client'

import { useEffect, useState } from "react"

export function Footer(){
    const [currentValue,setCurrentValue] = useState('en')
    function handleLanguageChange(lang:string){
        localStorage.setItem('lang',lang)
        window.location.reload()
    }
    useEffect(()=>{
        setCurrentValue(localStorage.getItem('lang'))
    },[])
    return(
        <div className="flex flex-col gap-2 py-8">
            {/* <div className="flex text-gray text-[13px] gap-2">
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
                <span>متن تستی</span>
            </div> */}
            <div className="w-full flex gap-4 justify-center text-gray text-[13px]">
                <span>
                    © 2025 Instagram از Meta
                </span>
                <select value={currentValue} onChange={(event)=>handleLanguageChange(event.target.value)} name="" id="">
                    <option value="fa">فارسی</option>
                    <option value="en">english</option>
                </select>
            </div>
        </div>
    )
}