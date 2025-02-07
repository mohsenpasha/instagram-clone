'use client'

import SideBar from "@/components/SideBar"
import React from "react"

export default function PostLayout({children}:{children:React.ReactNode}){
    return(
        <div className="flex">
            <SideBar/>
            
            <div className="flex w-full md:w-11/12 lg:10/12 justify-center">
                <div className="w-full md:px-4 xl:px-0 lg:w-10/12 xl:w-8/12">
                    {children}
                </div>
            </div>
        </div>
    )
}