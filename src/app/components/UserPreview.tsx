'use client'
import Image from "next/image";
import Link from "next/link";
import { FollowBtn } from "./FollowBtn";
type userPreview = {
    mouseEnter? : (event:React.MouseEvent<Element, MouseEvent>,username:string)=> void,
    mouseOut?: (event:React.MouseEvent<Element, MouseEvent>)=> void,
    isReel?:boolean,
    userData:{
        username:string,
        name?:string,
        profile_pic:string,
        is_following:boolean
    }
}
export function UserPreview({mouseEnter,mouseOut,userData,isReel=false}:userPreview){
    const currentUsername = localStorage.getItem("currentUsername");
    return(
        <>
            <div className="py-2 px-4">
                <div className={`flex ${isReel ? 'gap-2' : 'gap-3'} items-center`}>
                    <Link href={'/' + userData.username} onMouseEnter={(event)=>mouseEnter && mouseEnter(event,userData.username)} onMouseOut={(event)=>mouseOut && mouseOut(event)} className={`${isReel ? 'size-8' : 'size-11'} rounded-full overflow-hidden flex-shrink-0 relative`}>
                        <Image className="rounded-full" src={userData.profile_pic || '/images/profile-img.jpeg'} alt="" width={isReel ? 32 : 44} height={isReel ? 32 : 44}></Image>
                    </Link>
                    <div className={`flex ${!isReel && "flex-1"} flex-col text-sm leading-[18px] relative`}>
                        <Link onMouseEnter={(event)=>mouseEnter && mouseEnter(event,userData.username)} onMouseOut={(event)=>mouseOut && mouseOut(event)} className="font-semibold truncate inline-block w-fit" href={'/' + userData.username}>
                            {userData.username}
                        </Link>
                        {!isReel && 
                            <span className="text-gray truncate">{userData.name}</span>
                        }
                    </div>
                    {isReel &&
                        <span className="bg-white rounded-full size-1"></span>
                    }
                    {currentUsername != userData.username && 
                        <div className="cursor-pointer flex-shrink-0 over text-sm">
                            <FollowBtn directUnfollow={isReel} userData={userData} inList={!isReel} isReel={isReel} haveIcon={false}/>
                        </div>
                    }
                </div>
            </div>
        </>

    )
}