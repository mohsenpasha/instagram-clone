'use client'
import SideBar from "@/components/SideBar";
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import i18n  from '@/../../i18n'
import { IconPosts, IconReels, IconTagged } from "@/components/Icons";
import StoryHolder, { StoryList } from "@/components/Story";


export default function ProfileLayout({children} : {children : React.ReactNode}){
    const params = useParams()
    const { t } = useTranslation();

    useEffect(()=>{
        // i18n.changeLanguage("fa")
    },[])
    return(
            <div className={`flex justify-between`}>
                <SideBar/>
                <div className="flex justify-center w-full md:w-[100vw-72px] xl:w-10/12">
                    <div className="w-full md:px-4 xl:px-0 lg:w-[930px]">
                        <ProfileHeader/>
                        <div className="flex w-full border-t-[1px] border-d justify-center">
                            <div className="w-full md:w-6/12 justify-around flex">
                                <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center gap-[6px] items-center" href={`/${params.id}/#`}>
                                    <IconPosts className="size-[12px]" />
                                    {t('post-t')}
                                </Link>
                                <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center gap-[6px] items-center" href={`/${params.id}/reels`}>
                                    <IconReels className="size-[12px]" />
                                    REELS
                                </Link>
                                <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center gap-[6px] items-center" href={`/${params.id}/tagged`}>
                                    <IconTagged className="size-[12px]" />
                                    {t('tagged')}
                                </Link>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
                {/* <StoryList /> */}
            </div>
    )
}