'use client'

import SideBar from "@/components/SideBar"
import React from "react"

export default function PostLayout({children}:{children:React.ReactNode}){
    return(
            <div className="flex">
                <SideBar/>
                <div className="flex justify-center w-full md:w-[100vw-72px] xl:w-10/12">
                    <div className="w-full md:px-4 xl:px-0 lg:w-[930px]">
                        {children}
                    </div>
                </div>
            </div>
    )
}