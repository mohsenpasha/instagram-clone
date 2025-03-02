'use client'

import SideBar from "@/components/SideBar"
import React from "react"

export default function ReelsLayout({children}:{children:React.ReactNode}){
    return(
            <div className="flex">
                <SideBar/>
                
                
                {children}

            </div>
    )
}