'use client'
import Image from "next/image"
import { IconClose, IconComment, IconDirect, IconHeart, IconMore, IconMute, IconPlay, IconSave, IconUnMute } from "./Icons"
import Link from "next/link"
import { Dispatch, Ref, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { useAnimationEnd } from "@/hooks/useAnimationEnd"
import { UserPreview } from "./UserPreview"
import useMediaQuery from "@/hooks/useMediaQuery"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { activatePostListStatus, addPostDetail, changeCommentId, changeListTitle, changeListUrl, clearCommentList, clearUserList, followPostListUser, followUserList, likeActivePostList, likePost, saveActivePostList, savePost, unlikeActivePostList, unsaveActivePostList, unsavePost } from "@/store/slices/postSlice"
import { fetchLikePost, fetchUnlikePost } from "@/api/likesApi"
import { CommentBox, CommentInput, UserList } from "./SinglePost"
import { useClickOutside } from "@/hooks/useClickOutside"
import { changeCurrentVisitingUser } from "@/store/slices/userSlice"
import { fetchSavePost, fetchUnsavePost } from "@/api/saveApi"
import { useTranslation } from "react-i18next"

export function ReelScroll(){
    const postList = useSelector((state: RootState) => state.popupPost.postList);
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const commentId = useSelector((state: RootState) => state.popupPost.commentId);
    const activeReelRef = useRef<HTMLDivElement>(null)
    const activeReelIndex = useRef(-1)
    const [sliderTop,setSliderTop] = useState(0)
    const [isVideoMuted,setIsVideoMuted] = useState(true)
    const isScrollAllowed = useRef(true)
    const isUnderXs = useMediaQuery("(max-width: 400px)");
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    const userListRef = useRef(null)
    const userHoverPreviewRef = useRef(null)
    useClickOutside([userListRef, userHoverPreviewRef], () => !unfollowDetail ? dispatch(changeListTitle(null)) : {});
    
    const dispatch = useDispatch()
    useEffect(()=>{
        window.addEventListener('keydown',(event)=>{keyboardHandler(event)})
        return ()=>{
            window.removeEventListener('keydown',(event)=>{keyboardHandler(event)}) 
        }
    },[])
    function wheelHandler(event: React.WheelEvent<HTMLDivElement>) {
        if (event.target instanceof Element && event.target.closest('.comment-box') != null) return;
    
        if (event.deltaY > 0) {
            changeActiveReel();
        } else {
            changeActiveReel('prev');
        }
    }
    function keyboardHandler(event: React.KeyboardEvent<HTMLDivElement>){
        if(event.key == 'ArrowUp'){
            changeActiveReel('prev')
        }
        else if(event.key == 'ArrowDown'){
            changeActiveReel()
        }
    }
    function changeActiveReel(dir: 'prev' | 'next' = 'next') {
        dispatch(clearCommentList())
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
            isScrollAllowed.current = false;
            setTimeout(() => {
                isScrollAllowed.current = true;
            }, 300);
        }
    }
    function reelScroll(){
        if(!activeReelRef.current) return
        const reelHeight = activeReelRef.current.getBoundingClientRect().height
        const reelTop = activeReelRef.current.getBoundingClientRect().top
        let finialTop = 0;
        if(isUnderXs){
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
        if(!postList && postList.length == 0) return
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
            <div onWheel={(event)=>wheelHandler(event)} className="flex flex-col w-full items-center relative overflow-hidden h-[100vh]">
                <div style={{top:sliderTop}} className="absolute flex transition-all duration-300 flex-col xs:gap-4 xs:pt-[5vh]">
                    {postList.map((item,index)=>{
                        return <SingleReel isVideoMuted={isVideoMuted} setIsVideoMuted={setIsVideoMuted} postData={item} key={index} ref={item.activeStatus ? activeReelRef : null}/>
                    })}
                </div>
            </div>
            {listTitle && 
                <UserList listType={commentId ? 'commentlikeList' : 'likeList'} targetId={commentId ? commentId : postList[activeReelIndex.current].id} ref={userListRef} hoverPreviewRef={userHoverPreviewRef} closePopup={()=>dispatch(changeListTitle(null))} />
            }
        </>
    )
}
type positionType = {left:number,top:number,bottom:number,height:number}
export function SingleReel({postData,ref,isVideoMuted,setIsVideoMuted}:{postData:{activeStatus:boolean},ref:RefObject<null> | null,isVideoMuted:boolean,setIsVideoMuted:Dispatch<SetStateAction<boolean>>}){
    const videoRef = useRef<HTMLVideoElement>(null)
    const [userPreviewHoverPosition,setUserPreviewHoverPosition] = useState<positionType>({left:0,top:0,bottom:0,height:0})
    const currentVsitingUser = useSelector((state: RootState)=> state.currentUser.currentVisitingUser)
    const commentList = useSelector((state: RootState)=> state.popupPost.commentList)
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const [isVideoPaused,setIsVideoPaused] = useState(false)
    const [isPlayIconAnimationStarted,setIsPlayIconAnimationStarted] = useState(false)
    const [isCaptionOpen,setIsCaptionOpen] = useState(false)
    const commentPopupRef = useRef(null)
    const [toggleCommentPopup,setToggleCommentPopup] = useState(false)
    useClickOutside(commentPopupRef,()=> listTitle ? {} : setToggleCommentPopup(false))
    const isUnderXs = useMediaQuery("(max-width: 400px)");
    const commentToggler = useRef(null)
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
                if(!postData.activeStatus) return
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
        window.addEventListener('resize',()=>{
            const position= getPosition(commentToggler.current as HTMLElement)
            setUserPreviewHoverPosition(position)
        })
    },[])
    useEffect(()=>{
        if(postData.activeStatus && !isVideoPaused){
            if(videoRef.current){
                videoRef.current.play()
            }
            dispatch(changeCurrentVisitingUser({...postData.user}))
            dispatch(addPostDetail({...postData}))
        }
        if(!postData.activeStatus){
            if(!videoRef.current) return
            videoRef.current.pause()
        }
    },[postData])
    function getPosition(element : HTMLElement){
        const rect = element.getBoundingClientRect();
        const elmClientHeight = element.clientHeight
        const distanceFromTop = rect.top;
        const distanceFromLeft = rect.left;
        const distanceFromBottom = window.innerHeight - rect.bottom;
        return {left:distanceFromLeft,top:distanceFromTop,height:elmClientHeight,bottom:distanceFromBottom}
    }
    useEffect(()=>{
        if(!toggleCommentPopup){
            dispatch(clearCommentList())
        }
    },[toggleCommentPopup])
    useEffect(()=>{
        if(!commentList) return
        if(commentList.length == 0){
            setToggleCommentPopup(false)
        }
    },[commentList])
    function openCommentBox(){
        setToggleCommentPopup(true)
        const position= getPosition(commentToggler.current as HTMLElement)
        setUserPreviewHoverPosition(position)
    }
    async function savePostHandler(){
            dispatch(saveActivePostList())
            const response = await fetchSavePost(postDetail.id)
        }
        async function unsavePostHandler(){
            dispatch(unsaveActivePostList())
            const response = await fetchUnsavePost(postDetail.id)
        }
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
                <div className="p-2 flex items-center flex-col gap-1 cursor-pointer">
                    <span onClick={()=>postData.is_liked ? unlikePostHandler() : likePostHandler()}>
                    {postData.is_liked ?
                        <IconHeart active className="flex-shrink-0 text-[#ff3041]"/>
                    :
                        <IconHeart className="flex-shrink-0"/>
                    }
                    </span>
                    <span onClick={()=>dispatch(changeListTitle('Likes'))} className="text-xs">{postData.like_count}</span>
                </div>
                {postDetail && 
                    <div ref={commentToggler} onClick={openCommentBox} className="p-2 cursor-pointer flex items-center flex-col gap-1">
                        <IconComment className="flex-shrink-0"/>
                        <span className="text-xs">{postData.comment_count}</span>
                    </div>
                }
                {/* <div className="p-2 flex items-center flex-col gap-1">
                    <IconDirect className="flex-shrink-0"/>
                </div> */}
                    <div onClick={()=> postData.is_saved ? unsavePostHandler() : savePostHandler()} className="p-2 flex items-center flex-col gap-1 cursor-pointer">
                        {postData.is_saved
                        ?
                            <IconSave active className="flex-shrink-0"/>
                        :
                            <IconSave className="flex-shrink-0"/>
                        }
                    </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconMore className="flex-shrink-0"/>
                </div>

                <Link href='#' className="flex my-2 items-center flex-col gap-1 rounded-[4px] border-[1px] border-black size-6 overflow-hidden hover:opacity-40">
                    <Image src={postData.user.profile_pic || '/images/profile-img-2.jpeg'} width={24} height={24} alt={""}></Image>
                </Link>
            </div>
            {toggleCommentPopup && 
                <CommentPopup position={userPreviewHoverPosition} closePopup={()=>setToggleCommentPopup(false)} ref={commentPopupRef} />
            }
        </div>
    )
}
export function ReelCaption({caption,isCaptionOpen,setIsCaptionOpen}:{caption:string,isCaptionOpen:boolean,setIsCaptionOpen:Dispatch<SetStateAction<boolean>>}){
    function toggleFullCaption(){
        setIsCaptionOpen(!isCaptionOpen)
    }
    const { t } = useTranslation();
        return(
            <div onClick={toggleFullCaption} className={`${isCaptionOpen ? 'max-h-44 overflow-y-auto' : 'max-h-[18px] overflow-hidden'} px-4 text-sm flex gap-1 transition-all cursor-pointer`}>
                <div className={`${isCaptionOpen ? 'w-full' : 'w-11/12 overflow-hidden'}`}>
                    <span className={!isCaptionOpen ? 'w-80 inline-block' : undefined}>{caption}</span>
                </div>
                {!isCaptionOpen && 
                    <span className="flex-shrink-0 opacity-70 cursor-pointer">{t('more')}</span>
                }
            </div>
        )
}

export function CommentPopup({ref,closePopup,position}:{ref:Ref<HTMLDivElement> | undefined, closePopup:()=> void,position:positionType}){
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const postDetail = useSelector((state: RootState)=> state.popupPost.postDetail)
    const [isRightSide,setIsRightSide] = useState(true)
    useEffect(()=>{
        if(window.innerWidth - position.left < 380){
            setIsRightSide(false)
        }
        else{
            setIsRightSide(true)
        }
    },[position])
    const { t } = useTranslation();
    if(!postDetail) return
    return(
        <div ref={ref} style={{left:isRightSide ? position.left + 36 : position.left - 320, bottom:position.bottom}} className="fixed z-40 flex flex-col rounded-md w-80 h-96 bg-white comment-box shadow-[0_4px_12px_rgba(0,0,0,.15)]">
            <div className="flex p-6 items-center rtl:justify-end relative">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
                    {t('comments')}
                </span>
                <span onClick={closePopup} className="">
                    <IconClose className="size-4"/>
                </span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <CommentBox closeCommentBox={closePopup} textareaRef={textareaRef} />
            </div>
            <div className="pr-2">
                <CommentInput inReel={true} textareaRef={textareaRef} />
            </div>
            <span className={`absolute border-t-[6px] border-t-white border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent bottom-8 ${isRightSide ? 'left-0 -ml-2 rotate-90' : 'right-0 -mr-2 -rotate-90'}`}></span>
        </div>
    )
}