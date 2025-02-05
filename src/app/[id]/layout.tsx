'use client'
import SideBar from "@/components/SideBar";
import { useParams } from 'next/navigation'
import React, { useEffect } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import i18n  from '@/../../i18n'

export default function ProfileLayout({children} : {children : React.ReactNode}){
    const params = useParams()
    const { t } = useTranslation();
    useEffect(()=>{
        // i18n.changeLanguage("fa")
    },[])
    console.log(params.id)
    return(
        <div className="flex">
            <SideBar/>
            <div className="flex justify-center w-full md:w-11/12 lg:10/12">
                            <div className="w-full md:px-4 xl:px-0 lg:w-11/12 xl:w-9/12">
                                <ProfileHeader/>
                                <div className="flex w-full border-t-[1px] border-d justify-center">
                                    <div className="w-full md:w-6/12 justify-around flex">
                                        <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center" href={`/${params.id}/#`}>
                                            {t('post-t')}
                                        </Link>
                                        <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center" href={`/${params.id}/reels`}>
                                            REELS
                                        </Link>
                                        <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center" href={`/${params.id}/tagged`}>
                                            {t('tagged')}
                                        </Link>
                                    </div>
                                </div>
                                {children}
                            </div>
                    </div>
            
        </div>
    )
}