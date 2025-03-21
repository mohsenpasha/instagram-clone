import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "next-i18next";
import PostList from "./PostList";
import { FollowBtn } from "./FollowBtn";
import { MessageBtn } from "./MessageBtn";
import { fetchGetUserHoverInfo } from "@/api/userHoverProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type hoverType = {
    position:{
        left:number,
        top:number,
        bottom:number,
        height:number
    },
    isHover:boolean,
    username:string
}

export default function UserHoverPreview({position,isHover,username,ref}:hoverType){
    const [userHoverInfo,setUserHoverInfo] = useState<null | {}>(null)
    const userList = useSelector((state: RootState) => state.popupPost.userList);
    const userDatailHover = userList?.filter((item)=>{
        return item.username == username
    })
    console.log(userDatailHover)
    async function doFetch(){
        const respose = await fetchGetUserHoverInfo(username)
        const JsonRes = await respose.json()
        setUserHoverInfo(JsonRes)
    }
    useEffect(()=>{
        if(isHover){
            doFetch()
        }
        },[isHover])
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
    }
    else{
        top = window.innerHeight - (position.bottom + 338) - position.height
    }
    const { t } = useTranslation();
    if(underMd) return
    if(!userHoverInfo) return
    console.log(userHoverInfo.recent_posts)
    return(
        <div ref={ref} style={{left:position.left | 0, top:top | 0}} className={`fixed text-sm py-4 top-0 flex flex-col justify-between bg-white z-[1000] w-[366px] h-[338px] shadow-[0_4px_12px_rgba(0,0,0,.15)] rounded-lg animate-fadeIn ${isHover ? 'flex' : 'hidden'} hover:flex`}>
            <div className="flex items-center gap-4 px-4">
                <div className="size-[56px] overflow-hidden">
                    <Image className="rounded-full w-full h-full object-cover" src={userHoverInfo.profile_pic || "/images/profile-img.jpeg"} alt='' width={56} height={56}></Image>
                </div>
                <div className="flex flex-col leading-4">
                    <span className="text-base font-bold">{userHoverInfo.username}</span>
                    <span>{userHoverInfo.name}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className='gap-1 flex flex-col items-center w-1/3 leading-4'>
                    <span className='font-bold'>{userHoverInfo.post_count}</span>
                    {t('posts')}
                </div>
                <div className='gap-1 flex flex-col items-center w-1/3 leading-4'>
                    <span className='font-bold'>{userHoverInfo.follower_count}</span>
                    {t('followers')}
                </div>
                <div className='gap-1 flex flex-col items-center w-1/3 leading-4'>
                    <span className='font-bold'>{userHoverInfo.following_count}</span>
                    {t('following')}
                </div>
            </div>
            {
            userHoverInfo.is_private ?
                <PostListUnavailable mode='private' username="test"/>
            :
            userHoverInfo.recent_posts.length == 0 ? 
                <PostListUnavailable mode='noPost' username="test"/>
            :
                <PostList isHoverPreview={true} postList={userHoverInfo.recent_posts} isReel={false} noIcon={true}/>
            }
            <div className="px-4 flex w-full gap-2">
                <div className="w-full">
                    <FollowBtn fullSize={true} userData={userDatailHover[0]}/>
                </div>
            </div>
        </div>
    )
}

export function PostListUnavailable({username,mode}:{username:string,mode:'private' | 'noPost'}){
    return(
        <div className="flex flex-col items-center justify-center gap-1 p-4 border-t-[1px] border-b-[1px] border-ss text-sm text-center">
            <div className="relative size-12 overflow-hidden">
                <Image className="absolute top-0" src='/images/np-s-i.png' alt="" width={49} height={98}></Image>
            </div>
            <span className="font-bold">{mode == 'private' ? "The account is private" : "No posts yet"}</span>
            <span className="text-gray">{mode == 'private' ? "Follow this account to see their photos and videos." : `When ${username} shares photos and reels, you'll see them here.`}</span>
        </div>
    )
}