'use client'
import Image from "next/image";
import Link from "next/link";
import UserHoverPreview from "./UserHoverPreview";
import { useState } from "react";
import { FollowBtn } from "./FollowBtn";

export function UserPreview({mouseEnter,mouseOut}:{mouseEnter : (event:React.MouseEvent<Element, MouseEvent>)=> void, mouseOut: (event:React.MouseEvent<Element, MouseEvent>)=> void}){
    
    return(
        <>
            
            <div className="py-2 px-4">
                <div className="flex gap-3 items-center">
                    <div onMouseEnter={(event)=>mouseEnter(event)} onMouseOut={(event)=>mouseOut(event)} className="rounded-full flex-shrink-0 relative">
                        <Image className="rounded-full" src='/images/profile-img-2.jpg' alt="" width={44} height={44}></Image>
                    </div>
                    <div className="flex flex-1 flex-col text-sm leading-[18px] relative">
                        <Link onMouseEnter={(event)=>mouseEnter(event)} onMouseOut={(event)=>mouseOut(event)} className="font-semibold truncate inline-block w-fit" href="#">
                            ali_ambrose1
                        </Link>
                        <span className="text-gray truncate">A̷̷̶̶Li</span>
                    </div>
                    <div className="cursor-pointer flex-shrink-0 over text-sm">
                        <FollowBtn haveIcon={false}/>
                    </div>
                </div>
            </div>
        </>

    )
}