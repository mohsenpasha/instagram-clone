'use client'

import { checkProtected } from "@/api/checkProtected"
import SideBar from "@/components/SideBar"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function AccountsLayout({children}:{children:React.ReactNode}){
    const [isLoggedIn,setIsLoggedIn] = useState(true)
    const router = useRouter();
    useEffect(()=>{
        async function fetchData() {
            try {
                const response = await checkProtected();
                const result = await response.json();
                if(response.status == 200){
                    console.log('logged in')
                    router.push("/")
                }
                else{
                    console.log('not logged in')
                    setIsLoggedIn(false)
                }
            } catch (error) {
                console.error("خطا:", error);
            }
        }
        fetchData();
    },[])
    if(isLoggedIn) return
    return(
        <>
            {children}
        </>
    )
}