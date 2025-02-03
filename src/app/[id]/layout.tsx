'use client'
import SideBar from "@/components/SideBar";
import { useParams } from 'next/navigation'
import React from "react";
import ProfileHeader from "@/components/ProfileHeader";

export default function ProfileLayout({children} : {children : React.ReactNode}){
    const params = useParams()

    console.log(params.id)
    return(
        <div className="flex">
            <SideBar/>
            <div className="flex justify-center w-full md:w-11/12 lg:10/12">
                            <div className="w-full md:px-4 xl:px-0 lg:w-11/12 xl:w-9/12">
                                <ProfileHeader/>
                                {children}
                            </div>
                    </div>
            
        </div>
    )
}