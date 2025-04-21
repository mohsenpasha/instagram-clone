import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "next-i18next";
import PostList from "./PostList";
import { FollowBtn } from "./FollowBtn";
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
    username:string,
    inComment?:boolean,
    ref:React.Ref<HTMLDivElement>
}

type userType = {
    username:string,
    profile_pic:string,
    name:string,
    is_following:boolean,
    is_private:boolean,
    post_count:number
    follower_count:number,
    following_count:number
    recent_posts:[]

}

export default function UserHoverPreview({position,isHover,username,ref,inComment=false}:hoverType){
    const [userHoverInfo,setUserHoverInfo] = useState<null | userType>(null)
    const userList = useSelector((state: RootState) => state.popupPost.userList);
    const [isRightSide,setIsRightSide] = useState(true)
    const userDatailHover = userList?.filter((item)=>{
        return item.username == username
    })
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
    useEffect(()=>{
        if(!isHover) return
        if(window.innerWidth - position.left < 370){
            setIsRightSide(false)
        }
        else{
            setIsRightSide(true)
        }
    },[isHover])
    const { t } = useTranslation();

    if(underMd) return
    return(
        <div ref={ref} style={{left:isRightSide ? position.left : position.left - 310 | 0, top:top | 0}} className={`fixed text-sm py-4 top-0 flex flex-col justify-between bg-white z-[1000] w-[366px] h-[338px] shadow-[0_4px_12px_rgba(0,0,0,.15)] rounded-lg animate-fadeIn ${isHover ? 'flex' : 'hidden'} hover:flex`}>
            {!userHoverInfo ? 
            <HoverUserPreviewLoading/>
            :
            <>
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
                        {inComment ?
                            <FollowBtn directUnfollow={true} inComment={inComment} fullSize={true} userData={userHoverInfo}/>
                        :
                        userDatailHover &&
                            <FollowBtn directUnfollow={true} fullSize={true} userData={userDatailHover[0]}/>
                        }
                    </div>
                </div>
            </>

            }

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


export function HoverUserPreviewLoading(){
    return(
        <div className="flex flex-col w-full justify-around flex-1">
            <div className="flex px-4 items-center gap-4">
                <span className="size-14 flex-shrink-0 rounded-full animate-Skeleton"></span>
                <div className="w-full flex flex-col gap-1">
                    <span className="w-8/12 h-4 animate-Skeleton rounded-[4px]"></span>
                    <span className="w-6/12 h-4 animate-Skeleton rounded-[4px]"></span>
                </div>
            </div>
            <div className="flex">
                {[...Array(3)].map((_,index)=>{
                    return(
                        <div key={index} className="w-1/3 flex flex-col items-center gap-1">
                            <span className="w-4/12 h-[14px] animate-Skeleton rounded-[4px]"></span>
                            <span className="w-6/12 h-[14px] animate-Skeleton rounded-[4px]"></span>
                        </div>
                    )
                })}
            </div>
            <div className="flex gap-[2px]">
            {[...Array(3)].map((_,index)=>{
                return <span key={index} className="w-1/3 aspect-square animate-Skeleton"></span>
            })}
            </div>
            <div className="px-4 w-full flex">
                <span className="w-full h-9 rounded-lg animate-Skeleton">

                </span>
            </div>
        </div>
    )
}