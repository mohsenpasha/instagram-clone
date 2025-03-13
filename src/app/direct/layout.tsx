'use client'

import SideBar from "@/components/SideBar"
import React from "react"

export default function DirectLayout({children}:{children:React.ReactNode}){
    return(
            <div className="flex">
                <SideBar isAlwaysMinimal={true}/>
                
                
                {children}

            </div>
    )
}