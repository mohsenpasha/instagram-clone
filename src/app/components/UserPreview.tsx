'use client'
import Image from "next/image";
import Link from "next/link";
import UserHoverPreview from "./UserHoverPreview";
import { useState } from "react";
import { FollowBtn } from "./FollowBtn";

export function UserPreview({mouseEnter,mouseOut,isReel=false}:{mouseEnter? : (event:React.MouseEvent<Element, MouseEvent>)=> void, mouseOut?: (event:React.MouseEvent<Element, MouseEvent>)=> void,isReel?:boolean}){
    return(
        <>
            
            <div className="py-2 px-4">
                <div className={`flex ${isReel ? 'gap-2' : 'gap-3'} items-center`}>
                    <div onMouseEnter={(event)=>mouseEnter && mouseEnter(event)} onMouseOut={(event)=>mouseOut && mouseOut(event)} className="rounded-full flex-shrink-0 relative">
                        <Image className="rounded-full" src='/images/profile-img-2.jpg' alt="" width={isReel ? 32 : 44} height={isReel ? 32 : 44}></Image>
                    </div>
                    <div className={`flex ${!isReel && "flex-1"} flex-col text-sm leading-[18px] relative`}>
                        <Link onMouseEnter={(event)=>mouseEnter && mouseEnter(event)} onMouseOut={(event)=>mouseOut && mouseOut(event)} className="font-semibold truncate inline-block w-fit" href="#">
                            ali_ambrose1
                        </Link>
                        {!isReel && 
                            <span className="text-gray truncate">A̷̷̶̶Li</span>
                        }
                    </div>
                    {isReel && 
                        <span className="bg-white rounded-full size-1"></span>
                    }
                    <div className="cursor-pointer flex-shrink-0 over text-sm">
                        <FollowBtn bgTrasparent={isReel} haveIcon={false}/>
                    </div>
                </div>
            </div>
        </>

    )
}