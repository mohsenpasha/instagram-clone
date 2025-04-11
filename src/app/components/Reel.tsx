'use client'
import Image from "next/image"
import { IconComment, IconDirect, IconHeart, IconMore, IconMute, IconPlay, IconSave, IconUnMute } from "./Icons"
import Link from "next/link"
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState, VideoHTMLAttributes } from "react"
import { useAnimationEnd } from "@/hooks/useAnimationEnd"
import { UserPreview } from "./UserPreview"
import useMediaQuery from "@/hooks/useMediaQuery"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { activatePostListStatus, changeCommentId, changeListTitle, changeListUrl, clearUserList, followPostListUser, followUserList, likeActivePostList, likePost, unlikeActivePostList } from "@/store/slices/postSlice"
import { fetchLikePost, fetchUnlikePost } from "@/api/likesApi"
import { CommentBox, UnfollowPopup, UserList } from "./SinglePost"
import { useClickOutside } from "@/hooks/useClickOutside"
import { changeCurrentVisitingUser, changeUnfollow } from "@/store/slices/userSlice"

export function ReelScroll(){
    const postList = useSelector((state: RootState) => state.popupPost.postList);
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const activeReelRef = useRef(null)
    const activeReelIndex = useRef(-1)
    const [sliderTop,setSliderTop] = useState(0)
    
    const [isVideoMuted,setIsVideoMuted] = useState(true)
    const isScrollAllowed = useRef(true)
    const isUnderXs = useMediaQuery("(max-width: 400px)");
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    const userListRef = useRef(null)
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    const userHoverPreviewRef = useRef(null)
    
    useClickOutside([userListRef, userHoverPreviewRef], () => !unfollowDetail ? dispatch(changeListTitle
        (null)) : {});
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    
    const dispatch = useDispatch()
    useEffect(()=>{
        window.addEventListener('keydown',(event)=>{keyboardHandler(event)})
        return ()=>{
            window.removeEventListener('keydown',(event)=>{keyboardHandler(event)}) 
        }
    },[])
    function wheelHandler(event){
        if(event.deltaY > 0){
            changeActiveReel()
        }
        else{
            changeActiveReel('prev')
        }
    }
    function keyboardHandler(event){
        if(event.key == 'ArrowUp'){
            changeActiveReel('prev')
        }
        else if(event.key == 'ArrowDown'){
            changeActiveReel()
        }
    }
    function changeActiveReel(dir: 'prev' | 'next' = 'next') {
        if (isScrollAllowed.current) {
            if(dir == 'next'){
                if(activeReelIndex.current < postList.length - 1){
                    activeReelIndex.current = activeReelIndex.current + 1
                }
            }
            else if(activeReelIndex.current > 0){
                activeReelIndex.current = activeReelIndex.current - 1
            }
            dispatch(activatePostListStatus(postList[activeReelIndex.current].id))
            console.log(activeReelIndex.current)
            isScrollAllowed.current = false;
            setTimeout(() => {
                isScrollAllowed.current = true;
            }, 300);
        }
    }
    function reelScroll(){
        const reelHeight = activeReelRef.current.getBoundingClientRect().height
        const reelTop = activeReelRef.current.getBoundingClientRect().top
        let finialTop = 0;
        if(isUnderXs){
            // const currentIndex = reelList.findIndex(item => item == true)
            finialTop = reelHeight * activeReelIndex.current * -1
        }
        else{
            finialTop = sliderTop -(reelTop - ((window.innerHeight - reelHeight) / 2))
            if(isUnderMd){
                finialTop -= 20
            }
        }
        setSliderTop(finialTop)
    }
    useEffect(()=>{
        if(postList.length == 0) return
        activeReelIndex.current = postList.findIndex((item)=> item.activeStatus == true)
        if(activeReelIndex.current == -1){
            dispatch(activatePostListStatus(postList[0].id))
            return
        }
        reelScroll()
    },[isUnderXs,isUnderMd,postList])
        useEffect(()=>{
            if(!listTitle){
                dispatch(clearUserList())
                dispatch(changeListUrl(null))
                dispatch(changeCommentId(null))
            }
        },[listTitle])
    return(
        <>
            <div onWheel={(event)=>wheelHandler(event)} onClick={reelScroll} className="flex flex-col w-full items-center relative overflow-hidden h-[100vh]">
                <div style={{top:sliderTop}} className="absolute flex transition-all duration-300 flex-col xs:gap-4 xs:pt-[5vh]">
                    {postList.map((item,index)=>{
                        return <SingleReel isVideoMuted={isVideoMuted} setIsVideoMuted={setIsVideoMuted} postData={item} key={index} ref={item.activeStatus ? activeReelRef : null}/>
                    })}
                </div>
            </div>
            {listTitle && 
                <UserList listType={'likeList'} targetId={postList[activeReelIndex.current].id} ref={userListRef} hoverPreviewRef={userHoverPreviewRef} closePopup={()=>dispatch(changeListTitle(null))} />
            }
            {/* {unfollowDetail &&
                <UnfollowPopup isReel={true} ref={unfollowPopupRef}/>
            } */}
        </>
    )
}
export function SingleReel({postData,ref,isVideoMuted,setIsVideoMuted}:{postData:{},ref:RefObject<null> | null,isVideoMuted:boolean,setIsVideoMuted:Dispatch<SetStateAction<boolean>>}){
    const videoRef = useRef(null)
    const currentVsitingUser = useSelector((state: RootState)=> state.currentUser.currentVisitingUser)
    const [isVideoPaused,setIsVideoPaused] = useState(false)
    const [isPlayIconAnimationStarted,setIsPlayIconAnimationStarted] = useState(false)
    const [isCaptionOpen,setIsCaptionOpen] = useState(false)
    const isUnderXs = useMediaQuery("(max-width: 400px)");
    const dispatch = useDispatch()
    const videoIconRef = useAnimationEnd(() => {
        setIsPlayIconAnimationStarted(false)
        });
    function unlikePostHandler(fetchLess=false){
            if(!fetchLess){
                fetchUnlikePost(postData.id)
            }
            dispatch(unlikeActivePostList())
        }
    async function likePostHandler(fetchLess=false){
            dispatch(likeActivePostList())
            if(!fetchLess){
                const respose = await fetchLikePost(postData.id)
                if(respose.status != 200){
                    console.log(respose)
                    unlikePostHandler(fetchLess=true)
                    dispatch(unlikeActivePostList())

                }
            }
        }
    function toggleSound(){
        if(videoRef.current){
            setIsVideoMuted(!videoRef.current.muted)
            videoRef.current.muted = !videoRef.current.muted
        }
    }
    function videoPlayToggle(){
        if(videoRef.current){
            if(videoRef.current.paused){
                videoRef.current.play()
                setIsVideoPaused(false)
                setIsPlayIconAnimationStarted(true)
            }
            else{
                setIsVideoPaused(true)
                videoRef.current.pause()
            }
        }
    }
    useEffect(()=>{
        if(postData.activeStatus && !isVideoPaused){
            videoRef.current.play()
            console.log(postData.user)
            dispatch(changeCurrentVisitingUser({...postData.user}))
        }
        if(!postData.activeStatus){
            videoRef.current.pause()
        }
    },[postData])
    return(
        <div ref={ref} className="flex gap-3 xs:static relative">
            <div className="xs:h-[90vh] xs:w-[calc(90vh*9/16)] h-[calc(100vh-48px)] w-[100vw] bg-black relative xs:rounded-md overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full z-10 flex items-center justify-center" onClick={isUnderXs ? toggleSound : videoPlayToggle}>
                    {(isVideoPaused || isPlayIconAnimationStarted) && 
                        <div ref={videoIconRef} className={`p-6 bg-black bg-opacity-40 rounded-full flex items-center justify-center ${isPlayIconAnimationStarted ? 'animate-scaleOut' :'animate-scale'}`}>
                            <IconPlay className="text-white"/>
                        </div>
                    }
                </div>
                <div className={`${isVideoMuted && 'hidden'} animate-scaleInOut xs:animate-none scale-0 xs:scale-100 absolute xs:right-2 xs:left-auto xs:top-2 top-1/2 left-1/2 xs:-translate-x-0 xs:-translate-y-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 bg-white text-white flex items-center justify-center bg-opacity-20 hover:bg-opacity-15 size-8 cursor-pointer`} onClick={toggleSound}>
                    <IconUnMute className="size-4"/>
                </div>
                <div className={`${!isVideoMuted && 'hidden'} animate-scaleInOut xs:animate-none scale-0 xs:scale-100 absolute xs:right-2 xs:left-auto xs:top-2 top-1/2 left-1/2 xs:-translate-x-0 xs:-translate-y-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 bg-white text-white flex items-center justify-center bg-opacity-20 hover:bg-opacity-15 size-8 cursor-pointer`} onClick={toggleSound}>
                    <IconMute className="size-4"/>
                </div>
                <div onClick={()=>isCaptionOpen ? setIsCaptionOpen(false) : undefined} className={`absolute bottom-0 left-0 w-full xs:h-auto flex flex-col justify-end py-4 z-20 text-white pr-8 xs:pr-0 ${isCaptionOpen ? 'from-[#00000000] to-[#000000AA] bg-gradient-to-b h-full' : ''}`}>
                    {currentVsitingUser && 
                        <UserPreview userData={currentVsitingUser} isReel={true}/>
                    }
                    <ReelCaption caption={postData.caption} isCaptionOpen={isCaptionOpen} setIsCaptionOpen={setIsCaptionOpen}/>
                </div>
                <video ref={videoRef} className="h-full w-full object-cover" muted={isVideoMuted} loop autoPlay={postData.activeStatus} src={postData.media[0].file}></video>
            </div>
            <div className="xs:static text-white xs:text-black absolute bottom-0 right-0 w-12 flex flex-col justify-end gap-2 items-center z-30">
                <div className="p-2 flex items-center flex-col gap-1">
                    <span className="cursor-pointer" onClick={()=>postData.is_liked ? unlikePostHandler() : likePostHandler()}>
                    {postData.is_liked ?
                        <IconHeart active className="flex-shrink-0 text-[#ff3041]"/>
                    :
                        <IconHeart className="flex-shrink-0"/>
                    }
                    </span>
                    <span onClick={()=>dispatch(changeListTitle('Likes'))} className="text-xs">{postData.like_count}</span>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconComment className="flex-shrink-0"/>
                    <span className="text-xs">{postData.comment_count}</span>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconDirect className="flex-shrink-0"/>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconSave className="flex-shrink-0"/>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconMore className="flex-shrink-0"/>
                </div>

                <Link href='#' className="flex my-2 items-center flex-col gap-1 rounded-[4px] border-[1px] border-black size-6 overflow-hidden hover:opacity-40">
                    <Image src={postData.user.profile_pic || '/images/profile-img-2.jpeg'} width={24} height={24} alt={""}></Image>
                </Link>
            </div>
        </div>
    )
}
export function ReelCaption({caption,isCaptionOpen,setIsCaptionOpen}:{caption:string,isCaptionOpen:boolean,setIsCaptionOpen:Dispatch<SetStateAction<boolean>>}){
    function toggleFullCaption(){
        setIsCaptionOpen(!isCaptionOpen)
    }
        return(
            <div onClick={toggleFullCaption} className={`${isCaptionOpen ? 'max-h-44 overflow-y-auto' : 'max-h-[18px] overflow-hidden'} px-4 text-sm flex gap-1 transition-all cursor-pointer`}>
                <div className={`${isCaptionOpen ? 'w-full' : 'w-11/12 overflow-hidden'}`}>
                    <span className={!isCaptionOpen ? 'w-80 inline-block' : undefined}>{caption}</span>
                </div>
                {!isCaptionOpen && 
                    <span className="flex-shrink-0 opacity-70 cursor-pointer">… more</span>
                }
            </div>
        )
}

export function commentPopup(){
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    return(
        <div>
            <CommentBox />
            test
        </div>
    )
}