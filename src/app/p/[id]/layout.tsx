'use client'

import SideBar from "@/components/SideBar"
import Provider from "@/context/provider"
import React from "react"

export default function PostLayout({children}:{children:React.ReactNode}){
    return(
        <Provider>
            <div className="flex">
                <SideBar/>
                
                
                {children}

            </div>
        </Provider>
    )
}