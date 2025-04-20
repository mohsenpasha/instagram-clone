'use client'
import { useDispatch, useSelector } from "react-redux";
import { PostCaption, TaggedPopup, UserList } from "./SinglePost";
import { RootState } from "@/store/store";
import { useTranslation } from "react-i18next";
import { fetchLikePost, fetchUnlikePost } from "@/api/likesApi";
import { activatePostListStatus, changeListTitle, changeUrl, likeActivePostList, likePost, saveActivePostList, savePost, unlikeActivePostList, unlikePost, unsaveActivePostList, unsavePost } from "@/store/slices/postSlice";
import { fetchSavePost, fetchUnsavePost } from "@/api/saveApi";
import { IconComment, IconDirect, IconHeart, IconMore, IconMute, IconSave, IconUnMute, IconUser } from "./Icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { changeUnfollow } from "@/store/slices/userSlice";
import { disableScroll, enableScroll } from "@/utils/scroll";
import Link from "next/link";
import useMediaQuery from "@/hooks/useMediaQuery";
import { PostPopupSlider } from "./PostPopupSlider";

export default function HomePosts(){
    const postList = useSelector((state: RootState)=> state.popupPost.postList)
    const postUrl = useSelector((state: RootState)=> state.popupPost.url)
    if(!postList) return
    return(
        <>
        <div>
            {postList.map((postDetail,index)=>{
                return(
                    <SingleHomePost key={index} isPopup={false} postDetail={postDetail}/>
                )
            })}
        </div>
        {postUrl && 
            <PostPopupSlider/>
        }

        </>
    )
}

export function SingleHomePost({isPopup,postDetail}:{isPopup:boolean,postDetail:{}}){
    const dispatch = useDispatch()
    const [commentToggle,setCommentToggle] = useState<boolean>(false)
    const underMd = useMediaQuery("(max-width: 768px)");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    const [isVideoMuted,setIsVideoMuted] = useState(true)
    const [sliderCurrentIndex,setSliderCurrentIndex] = useState(0)
    const [isTaggedVisible,setIsTaggedVisible] = useState(false)
    const videoRefs = useRef([])
    const TaggedRef = useRef(null)
    useClickOutside(TaggedRef, () => setIsTaggedVisible(false));
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    const { t } = useTranslation();
    function handleLikeList(){
        dispatch(changeListTitle('Likes'))
        dispatch(activatePostListStatus(postDetail.id))
    }
    function handleCommentToggle(){
        if(underMd){
            if(commentToggle){
                enableScroll()
            }
            else{
                disableScroll()
            }
        }
        setCommentToggle(!commentToggle)
        textareaRef.current?.focus()
    }
    function toggleVideoPause(index?:number,action?:'play' | 'pause') {
        const currentVideo = videoRefs.current[index];
        videoRefs.current.forEach((video) => {
            if (!video.paused && video != currentVideo) {
              video.pause();
            }
          });
          if(!index) return
        if (currentVideo) {
            if (action == 'play') {
                setTimeout(()=>{
                    currentVideo.play();
                },300)
            }
            else if(action == 'pause') {
                currentVideo.pause();
            }
            else{
                if (currentVideo.paused) {
                    setTimeout(()=>{
                        currentVideo.play();
                    },300)
                }
                else {
                    currentVideo.pause();
                }
            }
        }
    }
    function handleSliderChange(dir:'next' | 'prev'){
        setIsTaggedVisible(false)
        if(dir == 'next'){
            if(sliderCurrentIndex + 1 < postDetail.media.length){
                setSliderCurrentIndex(sliderCurrentIndex + 1)
            }
        }
        else{
            if(sliderCurrentIndex - 1 >= 0){
                setSliderCurrentIndex(sliderCurrentIndex - 1)
            }
        }
    }
    useEffect(()=>{
        if(postDetail?.media[sliderCurrentIndex].media_type == 'video'){
            toggleVideoPause(sliderCurrentIndex,'play')
        }
        else{
            toggleVideoPause()
        }
    },[sliderCurrentIndex])
    return(
        <>
            <div className={`bg-white flex flex-col relative pb-12 md:pb-0 ${isPopup && 'md:max-w-max'} flex-wrap md:flex-nowrap border-t-[1px] border-ss`}>
                {postDetail.media[sliderCurrentIndex].media_type == 'video' && isTaggedVisible &&
                    <TaggedPopup sliderCurrentIndex={sliderCurrentIndex} ref={TaggedRef} closePopup={()=>setIsTaggedVisible(false)}/>
                }
                <div className="relative mt-[70px] md:mt-0 w-full md:w-fit">
                <div className="flex items-center absolute md:static top-0 right-0 w-full">
                        <div className="flex h-[70px] md:h-auto items-center gap-2 py-[14px] w-full border-b-[1px] md:border-b-0 border-ss justify-between">
                            <div className="flex gap-2 w-11/12 sm:w-10/12 truncate items-center">
                                <Link href={'/' + postDetail?.user.username} className="rounded-full cursor-pointer size-8 overflow-hidden">
                                    <Image className="rounded-full" src={postDetail.user.profile_pic || '/images/profile-img.jpeg'} width={32} height={32} alt=""></Image>
                                </Link>
                                <div className="w-9/12 sm:w-11/12 md:w-9/12">
                                    <Link href={'/' + postDetail?.user.username}  className="text-sm font-medium inline-block">
                                        {postDetail.user.username}
                                    </Link>
                                    {/* <div className="text-xs truncate">
                                        Dariu$h, Saeed Dehghan • Jadid Free$Tyle
                                    </div> */}
                                </div>
                            </div>
                            <div>
                                <IconMore className="cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                    <div dir="ltr" className="relative w-full h-full aspect-[4/5] overflow-hidden">
                        <div className="flex h-full transition-transform group cursor-pointer" style={{ transform: `translateX(-${sliderCurrentIndex * 100}%)` }}>
                            {postDetail.media.map((item,index)=>{
                                return(
                                    <div key={index} className="relative w-full h-full flex-shrink-0">
                                        {item.media_type == 'image' ? 
                                            <Image onClick={()=>setIsTaggedVisible(!isTaggedVisible)}
                                                src={item.file}
                                                alt="Sample"
                                                width={1080}
                                                height={1080}
                                                className="object-cover w-full h-full static"
                                                />
                                        :
                                        <div className="relative cursor-pointer h-full overflow-hidden">
                                            <video className="h-full w-full object-cover" onClick={()=>toggleVideoPause(index)} loop ref={el => (videoRefs.current[index] = el)} autoPlay muted={isVideoMuted} src={item.file}></video>
                                            <span onClick={()=>setIsVideoMuted(!isVideoMuted)} className="absolute bottom-4 right-4 bg-[#262626] rounded-full flex justify-center items-center size-7 cursor-pointer">
                                                {isVideoMuted ?
                                                    <IconMute className="size-3 text-white"/>
                                                :
                                                    <IconUnMute className="size-3 text-white"/>
                                                }
                                            </span>
                                        </div>
                                        }
                                        {item.tagged_users.length != 0 &&
                                        <>
                                            {item.media_type != 'video' && item.tagged_users.map((tagged,index)=>{
                                                return(
                                                    <Link key={index} style={{top:tagged.y + 10,left:tagged.x}} className={`${isTaggedVisible ? 'scale-1 opacity-1': 'scale-0 opacity-0'} transition-all translate-x-1/2 origin-top duration-200 px-3 h-9 flex items-center absolute rounded-[4px] text-white bg-black bg-opacity-80`} href={'/' + tagged.user.username}>
                                                        <span className="block absolute -top-[5px] left-1/2 -translate-x-1/2 border-b-[6px] border-l-transparent border-r-transparent border-l-[6px] border-r-[6px] border-b-black border-opacity-80 w-0 h-0"></span>
                                                        <span className="font-semibold text-sm">{tagged.user.username}</span>
                                                    </Link>
                                                )
                                            })}
                                            <span onClick={()=>setIsTaggedVisible(!isTaggedVisible)} className={`group-hover:opacity-100 transition-opacity ${!isTaggedVisible && 'opacity-0'} absolute size-7 flex items-center justify-center bottom-4 left-4 rounded-full bg-black`}>
                                                <IconUser className="text-white"/>
                                            </span>
                                        </>
                                        }
                                    </div>
                                )
                            })}
                            <div className="w-full flex-shrink-0">
                                <img src='/images/post-prev-1.jpg' className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full flex-shrink-0">
                                <img src='/images/food-1.png' className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full flex-shrink-0">
                                <img src='/images/post-1.jpg' className="w-full h-full object-cover" />
                            </div>
                        </div>
                        {postDetail.media.length > 1 && 
                            <>
                                {sliderCurrentIndex < postDetail.media.length - 1 && 
                                    <span onClick={()=>handleSliderChange('next')} className="absolute top-1/2 right-2 -translate-y-1/2 bg-[position:-162px_-98px] bg-[url(/images/icons.png)] w-[30px] h-[30px] cursor-pointer"></span>
                                }
                                {sliderCurrentIndex != 0 && 
                                    <span onClick={()=>handleSliderChange('prev')} className="absolute top-1/2 left-2 -translate-y-1/2 rotate-180 bg-[position:-162px_-98px] bg-[url(/images/icons.png)] w-[30px] h-[30px] cursor-pointer"></span>
                                }
                                <div className="absolute flex gap-1 bottom-4 left-1/2 -translate-x-1/2">
                                    {[...Array(postDetail.media.length)].map((_,index)=>{
                                        return <span key={index} className={`size-[6px] rounded-full transition-opacity bg-white ${index != sliderCurrentIndex && 'opacity-45'}`}></span>
                                    })}
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="flex-1 flex flex-col h-full min-w-[320px]">
                    <div className="">
                        <HomePostAction handleCommentToggle={handleCommentToggle} postDetail={postDetail} />
                        {postDetail.like_count != 0 &&
                            <div onClick={()=>handleLikeList()} className="font-bold text-sm cursor-pointer">
                                <span>{postDetail.like_count}</span> {t('likes')}
                            </div>
                        }
                        <div className="flex-1 flex flex-col overflow-auto">
                            {postDetail.caption && 
                                <PostCaption isHomePost={true} caption={postDetail.caption} user={postDetail.user} updated_at={postDetail.updated_at} />
                            }
                        </div>
                        {postDetail.comment_count != 0 &&
                            <div onClick={handleCommentToggle} className="block md:hidden text-gray text-sm cursor-pointer">
                                {t('view-all')} <span>{postDetail.comment_count}</span> {t('cs')}
                            </div>
                        }
                        {/* <CommentInput textareaRef={textareaRef} className="hidden md:flex" /> */}
                    </div>
                </div>
            </div>
        </>
        
    )
}


export function HomePostAction({handleCommentToggle,postDetail}:{handleCommentToggle:()=>void,postDetail:{}}){
    const dispatch = useDispatch()
    const { t } = useTranslation();
    async function likePostHandler(fetchLess=false){
        dispatch(activatePostListStatus(postDetail.id))
        dispatch(likeActivePostList())
        if(!fetchLess){
            const respose = await fetchLikePost(postDetail.id)
            if(respose.status != 200){
                console.log(respose)
                unlikePostHandler(fetchLess=true)
            }
        }
    }
    function unlikePostHandler(fetchLess=false){
        dispatch(activatePostListStatus(postDetail.id))
        if(!fetchLess){
            fetchUnlikePost(postDetail.id)
        }
        dispatch(unlikeActivePostList())
    }
    async function savePostHandler(){
        dispatch(activatePostListStatus(postDetail.id))
        dispatch(saveActivePostList())
        const response = await fetchSavePost(postDetail.id)
    }
    async function unsavePostHandler(){
        dispatch(activatePostListStatus(postDetail.id))
        dispatch(unsaveActivePostList())
        const response = await fetchUnsavePost(postDetail.id)
    }
    function clickHandle(event){
        event.preventDefault(``)
        dispatch(changeUrl(`/p/${postDetail.id}`))
    }
    return(
        <div className="pt-[6px] flex justify-between w-full items-center">
            <div className="flex items-center gap-4 py-2">
                <span className="cursor-pointer" onClick={()=>postDetail.is_liked ? unlikePostHandler() : likePostHandler()} title={t('like')}>
                    {postDetail.is_liked ?
                        <IconHeart active className="cursor-pointer size-6 text-[#ff3041]"/>
                        :
                        <IconHeart className="cursor-pointer size-6 hover:text-zinc-500"/>
                    }
                </span>
                <span onClick={clickHandle} title={t('comment')}>
                    <IconComment className="cursor-pointer size-6 hover:text-zinc-500"/>
                </span>
                {/* <span title={t('share')}>
                    <IconDirect  className="cursor-pointer size-6 hover:text-zinc-500"/>
                </span> */}
            </div>
            <div>
                <span onClick={()=> postDetail.is_saved ? unsavePostHandler() : savePostHandler()} title={t('save')}>
                    {postDetail.is_saved ?
                        <IconSave active className="cursor-pointer size-6"/>
                    :
                        <IconSave className="cursor-pointer size-6 hover:text-zinc-500"/>
                    }
                </span>
            </div>
        </div>
    )
}