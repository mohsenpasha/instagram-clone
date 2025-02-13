import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "next-i18next";
import PostList from "./PostList";
import { FollowBtn } from "./FollowBtn";
import { MessageBtn } from "./MessageBtn";

export default function UserHoverPreview({position,isHover}:{position:{left:number,top:number,bottom:number,height:number},isHover:boolean}){
    const [underMd,setUnderMd] = useState<boolean>(false)
    function handlePageResize(){
        if(window.innerWidth < 768){
            setUnderMd(true)
        }
        else{
            setUnderMd(false)
        }
    }
    window.addEventListener('resize',handlePageResize)
    useEffect(()=>{
        handlePageResize()
    },[])
    let top = 0
    if(position.top < position.bottom){
        top =  position.top + position.height
        console.log('top')
    }
    else{
        top = window.innerHeight - (position.bottom + 338) - position.height
        console.log('bottom')
    }
    const { t } = useTranslation();

    // console.log(position.top)
    console.log(position.bottom)
    if(underMd) return
    return(
        <div style={{left:position.left | 0, top:top | 0}} className={`fixed text-sm py-4 top-0 flex flex-col justify-between bg-white z-[1000] w-[366px] h-[338px] shadow-[0_4px_12px_rgba(0,0,0,.15)] rounded-lg animate-fadeIn ${isHover ? 'flex' : 'hidden'} hover:flex`}>
            <div className="flex items-center gap-4 px-4">
                <div className="size-[56px]">
                    <Image className="rounded-full" src="/images/profile-img-2.jpg" alt='' width={56} height={56}></Image>
                </div>
                <div className="flex flex-col leading-4">
                    <span className="text-base font-bold">ali_ambrose1</span>
                    <span>A̷̷̶̶Li</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className='gap-1 flex flex-col items-center w-1/3 leading-4'>
                    <span className='font-bold'>100</span>
                    {t('posts')}
                </div>
                <div className='gap-1 flex flex-col items-center w-1/3 leading-4'>
                    <span className='font-bold'>245</span>
                    {t('followers')}
                </div>
                <div className='gap-1 flex flex-col items-center w-1/3 leading-4'>
                    <span className='font-bold'>124</span>
                    {t('following')}
                </div>
            </div>
            <PostList isReel={false} noIcon={true}/>
            <div className="px-4 flex w-full gap-2">
                <div className="flex-1">
                    <MessageBtn bg={'blue'}/>
                </div>
                <div className="flex-1">
                    <FollowBtn/>
                </div>
            </div>
        </div>
    )
}