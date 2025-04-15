import Image from "next/image";
import { IconArrow, IconClose, IconComment, IconDirect, IconEmoji, IconHeart, IconLoading, IconLoadingButton, IconMore, IconMute, IconPlusCircle, IconSave, IconUnMute, IconUser } from "./Icons";
import { useTranslation } from "next-i18next";
import React, { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { UserPreview } from "./UserPreview";
import UserHoverPreview from "./UserHoverPreview";
import { disableScroll, enableScroll } from "@/utils/scroll";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector,useDispatch } from "react-redux";
import { likePost, savePost, unlikePost, unsavePost, addUserList, listToggleIsLoading, changeListUrl, addCommentList, changeListTitle, changeCommentId, toggleLikeComment, addReplyList, toggleLikeReplyComment, clearReplyList, changeRepliedTo, increaseReplyCount, increaseCommentCount, followPostListUser, increasePostListCommentCount } from '@/store/slices/postSlice'
import { fetchlikeComment, fetchLikePost, fetchUnlikeComment, fetchUnlikePost } from "@/api/likesApi";
import { fetchSavePost, fetchUnsavePost } from "@/api/saveApi";
import { RootState } from "@/store/store";
import { changeUnfollow, toggleIsLoading } from "@/store/slices/userSlice";
import useMediaQuery from "@/hooks/useMediaQuery";
import { fetchSimpleGet } from "@/api/simpleGet";
import Link from "next/link";
import { fetchAddComment } from "@/api/commentApi";
import { stringToLink } from "@/utils/idAndHastagConvertor";


export default function SinglePost({isPopup}:{isPopup:boolean}){
    const dispatch = useDispatch()
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
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
            <div className={`bg-white flex border-[1px] border-ss relative pb-12 md:pb-0 md:h-[85vh] ${isPopup && 'md:max-w-max'} flex-wrap md:flex-nowrap`}>
                {postDetail.media[sliderCurrentIndex].media_type == 'video' && isTaggedVisible &&
                    <TaggedPopup sliderCurrentIndex={sliderCurrentIndex} ref={TaggedRef} closePopup={()=>setIsTaggedVisible(false)}/>
                }
                <div className="relative mt-[70px] md:mt-0 w-full md:w-fit">
                    <div className="relative w-full h-full aspect-[4/5] overflow-hidden">
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
                    <div className="flex items-center absolute md:static top-0 right-0 w-full">
                        <div className="flex h-[70px] md:h-auto items-center gap-2 px-[16px] py-[14px] w-full border-b-[1px] md:border-b-0 border-ss justify-between">
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
                    <div className="flex-1 flex flex-col overflow-auto">
                        {postDetail.caption && 
                            <PostCaption caption={postDetail.caption} user={postDetail.user} updated_at={postDetail.updated_at} />
                        }
                        {postDetail.comment_count != 0 ?
                            (underMd 
                                ? 
                                commentToggle && <CommentBox textareaRef={textareaRef} closeCommentBox={handleCommentToggle} />
                                :
                                <>
                                <CommentBox textareaRef={textareaRef}/>
                            </>
                            )
                            :
                            <NoComment/>
                        }
                    </div>
                    <div className="px-2">
                        <PostAction handleCommentToggle={handleCommentToggle} />
                        {postDetail.like_count != 0 &&
                            <div onClick={()=>handleLikeList()} className="mx-2 font-bold text-sm cursor-pointer">
                                <span>{postDetail.like_count}</span> {t('likes')}
                            </div>
                        }
                        {postDetail.comment_count != 0 &&
                            <div onClick={handleCommentToggle} className="block mx-2 md:hidden text-gray text-sm cursor-pointer">
                                {t('view-all')} <span>{postDetail.comment_count}</span> {t('cs')}
                            </div>
                        }
                        <div className="mx-2 text-xs cursor-pointer text-gray m-2">
                            {postDetail.updated_at.t_ago}{postDetail.updated_at.t}
                        </div>
                        <CommentInput textareaRef={textareaRef} className="hidden md:flex" />
                    </div>
                </div>
            </div>
        </>
        
    )
}

export function PostAction({handleCommentToggle}:{handleCommentToggle:()=>void}){
    const dispatch = useDispatch()
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const { t } = useTranslation();
    async function likePostHandler(fetchLess=false){
        dispatch(likePost())
        if(!fetchLess){
            const respose = await fetchLikePost(postDetail.id)
            if(respose.status != 200){
                console.log(respose)
                unlikePostHandler(fetchLess=true)
            }
        }
    }
    function unlikePostHandler(fetchLess=false){
        if(!fetchLess){
            fetchUnlikePost(postDetail.id)
        }
        dispatch(unlikePost())
    }
    async function savePostHandler(){
        dispatch(savePost())
        const response = await fetchSavePost(postDetail.id)
    }
    async function unsavePostHandler(){
        dispatch(unsavePost())
        const response = await fetchUnsavePost(postDetail.id)
    }
    return(
        <div className="py-2 pt-[6px] flex justify-between w-full items-center">
            <div className="flex items-center">
                <span className="cursor-pointer" onClick={()=>postDetail.is_liked ? unlikePostHandler() : likePostHandler()} title={t('like')}>
                    {postDetail.is_liked ?
                        <IconHeart active className="cursor-pointer m-2 size-6 text-[#ff3041]"/>
                        :
                        <IconHeart className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                    }
                </span>
                <span onClick={handleCommentToggle} title={t('comment')}>
                    <IconComment className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                </span>
                <span title={t('share')}>
                    <IconDirect  className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                </span>
            </div>
            <div>
                <span onClick={()=> postDetail.is_saved ? unsavePostHandler() : savePostHandler()} title={t('save')}>
                    {postDetail.is_saved ?
                        <IconSave active className="cursor-pointer m-2 size-6"/>
                    :
                        <IconSave className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                    }
                </span>
            </div>
        </div>
    )
}
export function PostCaption({caption,user,updated_at}){
    return(
        <div className="flex justify-between py-3 px-2 md:px-0 ltr:md:pl-6 rtl:md:pr-6">
        <div className="flex gap-2">
            <Link href={'/' + user.username} className="rounded-full flex-shrink-0 cursor-pointer size-8 overflow-hidden">
                <Image className="rounded-full" src={user.profile_pic || '/images/profile-img-2.jpg'} width={32} height={32} alt=""></Image>
            </Link>
            <div className="flex-col md:flex">
                <div className="block">
                    <Link href={'/' + user.username}  className="text-sm pr-1 rtl:pr-0 rtl:pl-1 inline mr-1 md:mr-0 font-medium float-left rtl:float-right">
                        {user.username}
                    </Link>
                    <div className="text-sm whitespace-break-spaces">
                        <span className="leading-3">
                            {stringToLink(caption)}
                        </span>
                    </div>
                </div>
                <div className="text-xs text-gray flex gap-2 font-medium mt-2">
                    {updated_at.t_ago &&
                        <div className="font-normal"><span>{updated_at.t_ago}</span>{updated_at.t}</div>
                    }
                </div>
            </div>
        </div>
        <div className="flex items-center cursor-pointer px-2">
            
        </div>
    </div>
    )
}
export function CommentInput({className,textareaRef,inReel=false} : {className?:string,textareaRef:RefObject<HTMLTextAreaElement | null>,inReel?:boolean}){
    const [value, setValue] = useState<string>("");
    const [emojiBottom,setEmojiBottom] = useState<boolean>(false)
    const [emojiBoxToggle,setEmojiBoxToggle] = useState<boolean>(false)
    const emojiBoxRef = useRef<HTMLDivElement>(null);
    const repliedTo = useSelector((state: RootState) => state.popupPost.replied_to);
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const dispatch = useDispatch()
    useEffect(()=>{
        if(!repliedTo) return
        setValue('@' + repliedTo.username + ' ')
        textareaRef.current?.focus()
    },[repliedTo])
    useClickOutside(emojiBoxRef, () => setEmojiBoxToggle(false));
    const handleInput = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        if(textareaRef.current){
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    };
    const emojiPositionFixer = (e : React.MouseEvent<HTMLDivElement>) => {
        const element = e.target as HTMLElement
        const rect = element.getBoundingClientRect();
        const distanceFromTop = rect.top;
        const distanceFromBottom = window.innerHeight - rect.bottom;
        
        if(distanceFromTop > distanceFromBottom) {
            setEmojiBottom(true)
        }
        else{
            setEmojiBottom(false)
        }
        setEmojiBoxToggle(!emojiBoxToggle)
    }
    const insertEmoji = (emoji: string) => {
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newValue =
            value.substring(0, start) + emoji + value.substring(end);
          setValue(newValue);

          setTimeout(() => {
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            textarea.focus();
          }, 0);
        }
      };
    async function fetchSend(){
        let requestData;
        if(repliedTo){
            requestData = {comment:value,postId:String(postDetail.id),replied_to:repliedTo.id}
        }
        else{
            requestData = {comment:value,postId:String(postDetail.id)}
        }
        const response = await fetchAddComment(requestData)
        if(response.status == 200){
            const jsonRes = await response.json()
            console.log(inReel)
            if(inReel){
                dispatch(increasePostListCommentCount())
            }
            else{
                dispatch(increaseCommentCount())
            }
            if(repliedTo){
                const newReply = {...jsonRes,parentCommentId:repliedTo.parentId || repliedTo.id}
                dispatch(addReplyList({id:(repliedTo.parentId || repliedTo.id),newReply:newReply}))
                dispatch(increaseReplyCount((repliedTo.parentId || repliedTo.id)))
            }
            else{
                // if(postDetail.comment_count == 0) return
                dispatch(addCommentList([jsonRes]))
            }
        }

    }
    function handleSendComment(){
            fetchSend()
            setValue('')
    }
    const { t } = useTranslation()
    return(
        <div className={`border-t-[1px] border-ss py-[6px] items-center flex gap-2 ${className}`}>
            <div className="relative cursor-pointer hidden md:block">
                <div onClick={emojiPositionFixer} className="py-2 px-4 inline-block"><IconEmoji/></div>
                {emojiBoxToggle && <EmojiBox insertEmoji={insertEmoji} emojiBoxRef={emojiBoxRef} isBottom0={emojiBottom}/>}
            </div>
            <div className="rounded-full cursor-pointer block md:hidden size-8 border-[1px] border-ss">
                <Image className="rounded-full" src='/images/profile-img.jpeg' width={32} height={32} alt=""></Image>
            </div>
            <textarea ref={textareaRef} className={`resize-none outline-none max-h-20 flex-1 text-sm items-center flex pr-1`} rows={1} onInput={handleInput} placeholder={t('add-comment')} value={value} name="" id=""></textarea>
            <button onClick={handleSendComment} disabled={!value} className="text-bl disabled:opacity-30 disabled:hover:text-bl hover:text-bll">Post</button>
        </div>
    )
}



export function EmojiBox({isBottom0,emojiBoxRef,insertEmoji} : {isBottom0? : boolean,emojiBoxRef : React.Ref<HTMLDivElement>,insertEmoji:(emoji: string) => void}) {
    
    const emojiList : {'name':string,'emoji':string[]}[] = [
        {
            "name":"Most popular",
            "emoji":["😂","😮","😍","😢","👏","🔥","🎉","💯","❤️","🤣","🥰","😘","😭","😊"]
        },
        {
            "name":"Activities",
            "emoji":["🕴","🧗","🧗‍♂️","🧗‍♀️","🏇","⛷","🏂","🏌","🏌️‍♂️","🏌️‍♀️","🏄","🏄‍♂️","🏄‍♀️","🚣","🚣‍♂️","🚣‍♀️","🏊","🏊‍♂️","🏊‍♀️","⛹","⛹️‍♂️","⛹️‍♀️","🏋","🏋️‍♂️","🏋️‍♀️","🚴","🚴‍♂️","🚴‍♀️","🚵","🚵‍♂️","🚵‍♀️","🤸","🤸‍♂️","🤸‍♀️","🤼","🤼‍♂️","🤼‍♀️","🤽","🤽‍♂️","🤽‍♀️","🤾","🤾‍♂️","🤾‍♀️","🤹","🤹‍♂️","🤹‍♀️","🧘","🧘‍♂️","🧘‍♀️","🎪","🛹","🎗","🎟","🎫","🎖","🏆","🏅","🥇","🥈","🥉","⚽","⚾","🥎","🏀","🏐","🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","⛳","⛸","🎣","🎽","🎿","🛷","🥌","🎯","🎱","🎮","🎰","🎲","🧩","♟","🎭","🎨","🧵","🧶","🎼","🎤","🎧","🎷","🎸","🎹","🎺","🎻","🥁","🎬","🏹",]
        },
        {
            "name":"Animals & Nature",
            "emoji":["🙈","🙉","🙊","💥","💫","💦","💨","🐵","🐒","🦍","🐶","🐕","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿","🦔","🦇","🐻","🐨","🐼","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊","🦅","🦆","🦢","🦉","🦚","🦜","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🐟","🐠","🐡","🦈","🐙","🐚","🐌","🦋","🐛","🐜","🐝","🐞","🦗","🕷","🕸","🦂","🦟","🦠","💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🌲","🌳","🌴","🌵","🌾","🌿","☘","🍀","🍁","🍂","🍃","🍄","🌰","🦀","🦞","🦐","🦑","🌍","🌎","🌏","🌐","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","☀","🌝","🌞","⭐","🌟","🌠","☁","⛅","⛈","🌤","🌥","🌦","🌧","🌨","🌩","🌪","🌫","🌬","🌈","☂","☔","⚡","❄","☃","⛄","☄","🔥","💧","🌊","🎄","✨","🎋","🎍",]
        },
        {
            "name":"Food & Drink",
            "emoji":["🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🥝","🍅","🥥","🥑","🍆","🥔","🥕","🌽","🌶","🥒","🥬","🥦","🍄","🥜","🌰","🍞","🥐","🥖","🥨","🥯","🥞","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥙","🍳","🥘","🍲","🥣","🥗","🍿","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🥢","🍽","🍴","🥄",]
        },
        {
            "name":"Objects",
            "emoji":["💌","🕳","💣","🛀","🛌","🔪","🏺","🗺","🧭","🧱","💈","🛢","🛎","🧳","⌛","⏳","⌚","⏰","⏱","⏲","🕰","🌡","⛱","🧨","🎈","🎉","🎊","🎎","🎏","🎐","🧧","🎀","🎁","🔮","🧿","🕹","🧸","🖼","🧵","🧶","🛍","📿","💎","📯","🎙","🎚","🎛","📻","📱","📲","☎","📞","📟","📠","🔋","🔌","💻","🖥","🖨","⌨","🖱","🖲","💽","💾","💿","📀","🧮","🎥","🎞","📽","📺","📷","📸","📹","📼","🔍","🔎","🕯","💡","🔦","🏮","📔","📕","📖","📗","📘","📙","📚","📓","📃","📜","📄","📰","🗞","📑","🔖","🏷","💰","💴","💵","💶","💷","💸","💳","🧾","✉","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","🗳","✏","✒","🖋","🖊","🖌","🖍","📝","📁","📂","🗂","📅","📆","🗒","🗓","📇","📈","📉","📊","📋","📌","📍","📎","🖇","📏","📐","✂","🗃","🗄","🗑","🔒","🔓","🔏","🔐","🔑","🗝","🔨","⛏","⚒","🛠","🗡","⚔","🔫","🛡","🔧","🔩","⚙","🗜","⚖","🔗","⛓","🧰","🧲","⚗","🧪","🧫","🧬","🔬","🔭","📡","💉","💊","🚪","🛏","🛋","🚽","🚿","🛁","🧴","🧷","🧹","🧺","🧻","🧼","🧽","🧯","🚬","⚰","⚱","🗿","🚰",]
        },
        {
            "name":"Smileys & People",
            "emoji":["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😤","😡","😠","🤬","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","💋","👋","🤚","🖐","✋","🖖","👌","✌","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍","💅","🤳","💪","🦵","🦶","👂","👃","🧠","🦷","🦴","👀","👁","👅","👄","👶","🧒","👦","👧","🧑","👱","👨","🧔","👨‍🦰","👨‍🦱","👨‍🦳","👨‍🦲","👩","👩‍🦰","👩‍🦱","👩‍🦳","👩‍🦲","👱‍♀️","👱‍♂️","🧓","👴","👵","🙍","🙍‍♂️","🙍‍♀️","🙎","🙎‍♂️","🙎‍♀️","🙅","🙅‍♂️","🙅‍♀️","🙆","🙆‍♂️","🙆‍♀️","💁","💁‍♂️","💁‍♀️","🙋","🙋‍♂️","🙋‍♀️","🙇","🙇‍♂️","🙇‍♀️","🤦","🤦‍♂️","🤦‍♀️","🤷","🤷‍♂️","🤷‍♀️","👨‍⚕️","👩‍⚕️","👨‍🎓","👩‍🎓","👨‍🏫","👩‍🏫","👨‍⚖️","👩‍⚖️","👨‍🌾","👩‍🌾","👨‍🍳","👩‍🍳","👨‍🔧","👩‍🔧","👨‍🏭","👩‍🏭","👨‍💼","👩‍💼","👨‍🔬","👩‍🔬","👨‍💻","👩‍💻","👨‍🎤","👩‍🎤","👨‍🎨","👩‍🎨","👨‍✈️","👩‍✈️","👨‍🚀","👩‍🚀","👨‍🚒","👩‍🚒","👮","👮‍♂️","👮‍♀️","🕵","🕵️‍♂️","🕵️‍♀️","💂","💂‍♂️","💂‍♀️","👷","👷‍♂️","👷‍♀️","🤴","👸","👳","👳‍♂️","👳‍♀️","👲","🧕","🤵","👰","🤰","🤱","👼","🎅","🤶","🦸","🦸‍♂️","🦸‍♀️","🦹","🦹‍♂️","🦹‍♀️","🧙","🧙‍♂️","🧙‍♀️","🧚","🧚‍♂️","🧚‍♀️","🧛","🧛‍♂️","🧛‍♀️","🧜","🧜‍♂️","🧜‍♀️","🧝","🧝‍♂️","🧝‍♀️","🧞","🧞‍♂️","🧞‍♀️","🧟","🧟‍♂️","🧟‍♀️","💆","💆‍♂️","💆‍♀️","💇","💇‍♂️","💇‍♀️","🚶","🚶‍♂️","🚶‍♀️","🏃","🏃‍♂️","🏃‍♀️","💃","🕺","🕴","👯","👯‍♂️","👯‍♀️","🧖","🧖‍♂️","🧖‍♀️","🧘","👭","👫","👬","💏","👨‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","💑","👨‍❤️‍👨","👩‍❤️‍👩","👪","👨‍👩‍👦","👨‍👩‍👧","👨‍👩‍👧‍👦","👨‍👩‍👦‍👦","👨‍👩‍👧‍👧","👨‍👨‍👦","👨‍👨‍👧","👨‍👨‍👧‍👦","👨‍👨‍👦‍👦","👨‍👨‍👧‍👧","👩‍👩‍👦","👩‍👩‍👧","👩‍👩‍👧‍👦","👩‍👩‍👦‍👦","👩‍👩‍👧‍👧","👨‍👦","👨‍👦‍👦","👨‍👧","👨‍👧‍👦","👨‍👧‍👧","👩‍👦","👩‍👦‍👦","👩‍👧","👩‍👧‍👦","👩‍👧‍👧","🗣","👤","👥","👣","🧳","🌂","☂","🧵","🧶","👓","🕶","🥽","🥼","👔","👕","👖","🧣","🧤","🧥","🧦","👗","👘","👙","👚","👛","👜","👝","🎒","👞","👟","🥾","🥿","👠","👡","👢","👑","👒","🎩","🎓","🧢","⛑","💄","💍","💼",]
        },
        {
            "name":"Symbols",
            "emoji":["💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🖤","💯","💢","💬","👁️‍🗨️","🗯","💭","💤","💮","♨","💈","🛑","🕛","🕧","🕐","🕜","🕑","🕝","🕒","🕞","🕓","🕟","🕔","🕠","🕕","🕡","🕖","🕢","🕗","🕣","🕘","🕤","🕙","🕥","🕚","🕦","🌀","♠","♥","♦","♣","🃏","🀄","🎴","🔇","🔈","🔉","🔊","📢","📣","📯","🔔","🔕","🎵","🎶","🏧","🚮","🚰","♿","🚹","🚺","🚻","🚼","🚾","⚠","🚸","⛔","🚫","🚳","🚭","🚯","🚱","🚷","🔞","☢","☣","⬆","↗","➡","↘","⬇","↙","⬅","↖","↕","↔","↩","↪","⤴","⤵","🔃","🔄","🔙","🔚","🔛","🔜","🔝","🛐","⚛","🕉","✡","☸","☯","✝","☦","☪","☮","🕎","🔯","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂","▶","⏩","◀","⏪","🔼","⏫","🔽","⏬","⏹","⏏","🎦","🔅","🔆","📶","📳","📴","✖","➕","➖","➗","♾","‼","⁉","❓","❔","❕","❗","♻","🔱","📛","🔰","⭕","✅","☑","✔","❌","❎","➰","➿","〽","✳","✴","❇","©","®","™","#️⃣","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔠","🔡","🔢","🔣","🔤","🅰","🆎","🅱","🆑","🆒","🆓","ℹ","🆔","Ⓜ","🆕","🆖","🅾","🆗","🅿","🆘","🆙","🆚","🈁","🈂","🈷","🈶","🈯","🉐","🈹","🈚","🈲","🉑","🈸","🈴","🈳","㊗","㊙","🈺","🈵","🔴","🔵","⚫","⚪","⬛","⬜","◼","◻","◾","◽","▪","▫","🔶","🔷","🔸","🔹","🔺","🔻","💠","🔳","🔲",]
        },
        {
            "name":"Travel & Places",
            "emoji":["🚣","🗾","🏔","⛰","🌋","🗻","🏕","🏖","🏜","🏝","🏞","🏟","🏛","🏗","🏘","🏚","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🕍","⛩","🕋","⛲","⛺","🌁","🌃","🏙","🌄","🌅","🌆","🌇","🌉","🎠","🎡","🎢","🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚚","🚛","🚜","🏎","🏍","🛵","🚲","🛴","🚏","🛤","⛽","🚨","🚥","🚦","🚧","⚓","⛵","🚤","🛳","⛴","🛥","🚢","✈","🛩","🛫","🛬","💺","🚁","🚟","🚠","🚡","🛰","🚀","🛸","🌠","🌌","⛱","🎆","🎇","🎑","💴","💵","💶","💷","🗿","🛂","🛃","🛄","🛅"]
        }
    ]
    
    return(
        <div ref={emojiBoxRef} className={`absolute w-[342] h-[325px] bg-white shadow-[0_4px_12px_rgba(0,0,0,.15)] p-2 overflow-y-scroll rounded-lg z-50 ${isBottom0 && 'bottom-10'}`}>
            {emojiList.map((category,index)=>{
                return(
                    <div key={index} className="mb-4">
                        <h2 className="text-sm text-gray font-semibold mb-2">{category.name}</h2>
                        <div className="flex flex-wrap">
                            {category.emoji.map((emoji, i) => (
                            <span onClick={()=>insertEmoji(emoji)} key={i} className="size-[44px] items-center justify-center flex text-[32px] hover:bg-zinc-200 cursor-pointer">{emoji}</span>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>        
    )
}

export function NoComment(){
    return(
        <div className="flex-1 flex flex-col justify-center items-center gap-1">
            <div className="text-2xl font-bold">No comments yet.</div>
            <span className="text-sm">Start the conversation.</span>
        </div>
    )
}
export function CommentBox({closeCommentBox,textareaRef}:{closeCommentBox?:()=>void,textareaRef:RefObject<HTMLTextAreaElement | null>}){
    const commentList = useSelector((state: RootState) => state.popupPost.commentList);
    const psotDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const { t } = useTranslation()
    const [currentUrl,setCurrentUrl] = useState('')
    const commentUrlRef = useRef(`http://localhost:8000/comments/${psotDetail.id}`)
    const [hasMore,setHasMore] = useState(false)
    const dispatch = useDispatch()
    const [moreCommentLoading,setMoreCommentLoading] = useState(false)
    async function fetchComments(){
        setMoreCommentLoading(true)
        const reposnse = await fetchSimpleGet(currentUrl)
        const jsonRes = await reposnse.json()
        console.log(jsonRes)
        dispatch(addCommentList(jsonRes.results))
        commentUrlRef.current = jsonRes.next
        if(jsonRes.next == null){
            setHasMore(false)
        }
        else{
            setHasMore(true)
        }
        setMoreCommentLoading(false)
    }
    useEffect(()=>{
        if(currentUrl){
            fetchComments()
        }
    },[currentUrl])
    useEffect(()=>{
        setHasMore(true)
        setMoreCommentLoading(true)
        setCurrentUrl(commentUrlRef.current)
    },[])
    function handleMoreComment(){
        setCurrentUrl(commentUrlRef.current)
    }
    return(
        <>
        <div className="fixed w-screen h-[calc(100vh-140px)] md:static md:w-auto md:h-auto md:block md:pb-0 top-0 right-0 bg-white px-4 pr-0 rtl:pr-4 flex-grow z-30">
            <div className="md:hidden h-11 flex items-center border-b-[1px] border-ss sticky top-0 bg-white">
                <span onClick={closeCommentBox} className="px-6 cursor-pointer">
                    <IconArrow className="-rotate-90"/>
                </span>
                <span className="font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{t('comments')}</span>
            </div>
            <div className="mx-2 mr-0 overflow-y-scroll md:overflow-auto h-[calc(100%-44px)] md:h-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                {commentList && commentList.map((item,index)=>{
                    return <Comment commentDetail={item} key={index} />
                })}
                {hasMore && 
                    <div onClick={handleMoreComment} className="flex justify-center items-center p-2">
                        {moreCommentLoading ? 
                            <IconLoading className="size-5"/>
                            :
                            <IconPlusCircle className="cursor-pointer"/>
                        }
                    </div>
                }
            </div>
            <CommentInput textareaRef={textareaRef} className="bg-white fixed pb-20 pt-8 bottom-0 left-0 w-full mx-0 p-4 flex md:hidden" />
        </div>
        </>
    )
}
function Comment({commentDetail,isReply}:{commentDetail:{},isReply?:boolean}){
    const dispatch = useDispatch()
    if(!commentDetail) return
    const repliedTo = useRef(commentDetail.user.username)
    const commentUrl = useRef(`http://localhost:8000/comment/replies/${commentDetail.id}`)
    const [isHover,setIsHover] = useState<boolean>(false)
    const [hoveringUsername,setHoveringUsername] = useState<null | string>(null)
    const [userPreviewHoverPosition,setUserPreviewHoverPosition] = useState<{left:number,top:number,bottom:number,height:number}>({left:0,top:0,bottom:0,height:0})
    const [replyLoading,setReplyLoading] = useState(false)
    const underMd = useMediaQuery("(max-width: 768px)");
    function mouseEnter(event : React.MouseEvent<Element, MouseEvent>,username:string){
        if(underMd) return
        setHoveringUsername(username)
        setIsHover(true)
        const number = getPosition(event.target as HTMLElement)
        setUserPreviewHoverPosition(number)
        }
    function mouseOut(event : React.MouseEvent<Element, MouseEvent>){
        setTimeout(() => {
            setIsHover(false)
        }, 100);
    }
    function handleLikeList(){
        dispatch(changeListTitle('Likes'))
        dispatch(changeCommentId(commentDetail.id))
    }
    async function fetchLike(){
        const response = await fetchlikeComment(commentDetail.id)
        if(response.status != 200){
            dispatch(toggleLikeComment({id:commentDetail.id,action:'unlike'}))
        }
    }
    async function fetchUnlike(){
        const response = await fetchUnlikeComment(commentDetail.id)
        if(response.status != 200){
            dispatch(toggleLikeComment({id:commentDetail.id,action:'like'}))
        }
    }
    function handleLikeComment(){
        console.log('isReply')
        console.log(isReply)
        console.log('isReply')
        if(commentDetail.is_liked){
            if(isReply){
                dispatch(toggleLikeReplyComment({replyId:commentDetail.id,commentId:commentDetail.parentCommentId,action:'unlike'}))
            }
            else{
                dispatch(toggleLikeComment({id:commentDetail.id,action:'unlike'}))
            }
            fetchUnlike()
        }
        else{
            if(isReply){
                dispatch(toggleLikeReplyComment({replyId:commentDetail.id,commentId:commentDetail.parentCommentId,action:'like'}))
            }
            else{
                dispatch(toggleLikeComment({id:commentDetail.id,action:'like'}))
            }
            fetchLike()
        }
    }
    const { t } = useTranslation()
    async function fetchReplies(){
        setReplyLoading(true)
        const response = await fetchSimpleGet(commentUrl.current)
        const jsonRes = await response.json()
        fixReplies(jsonRes.results)
        commentUrl.current = jsonRes.next
        setReplyLoading(false)
    } 
    function getReplies(){
        fetchReplies()
    }
    function hideReplies(){
        commentUrl.current = `http://localhost:8000/comment/replies/${commentDetail.id}`
        dispatch(clearReplyList(commentDetail.id))

    }
    function fixReplies(repliedCommentDetail){
        repliedCommentDetail.map((item)=>{
            let { replies, reply_count, ...newCommentDetail } = item;
            newCommentDetail = {...newCommentDetail,replied_to:repliedTo.current}
            newCommentDetail = {...newCommentDetail,parentCommentId:commentDetail.id}
            dispatch(addReplyList({id:commentDetail.id,newReply:newCommentDetail}))
            if(item.replies){
                repliedTo.current = item.user.username
                fixReplies(item.replies)
            }
            repliedTo.current = commentDetail.user.username
        })
    }
    function handleReply(){
        if(commentDetail.parentCommentId){
            dispatch(changeRepliedTo({id:commentDetail.id,username:commentDetail.user.username,parentId:commentDetail.parentCommentId}))
        }
        else{
            dispatch(changeRepliedTo({id:commentDetail.id,username:commentDetail.user.username}))
        }
    }
    const parsedContent = stringToLink(commentDetail.comment);
    return(
        <>
            <div className={`flex justify-between py-3 px-2 md:px-0 ${isReply && '!pl-8'}`}>
                <div className="flex flex-1 gap-2">
                    <Link href={'/' + commentDetail?.user.username} onMouseEnter={mouseEnter} onMouseOut={mouseOut} className="rounded-full flex-shrink-0 cursor-pointer size-8 overflow-hidden">
                        <Image className="rounded-full" src={commentDetail.user.profile_pic || '/images/profile-img.jpeg'} width={32} height={32} alt=""></Image>
                    </Link>
                    <div className="flex-col flex-1 md:flex">
                        <div className="block">
                            <Link href={'/' + commentDetail?.user.username} onMouseEnter={mouseEnter} onMouseOut={mouseOut} className="text-sm pr-1 rtl:pr-0 rtl:pl-1 inline mr-1 md:mr-0 font-medium float-left rtl:float-right">
                                {commentDetail.user.username}
                            </Link>
                            <div className="text-sm whitespace-break-spaces">
                                <span className="leading-3">
                                    {stringToLink(commentDetail.comment)}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-gray flex gap-2 font-medium mt-2">
                            <div className="font-normal">
                                {commentDetail.updated_at.t_ago ? 
                                <span>{commentDetail.updated_at.t_ago}{commentDetail.updated_at.t}</span>
                                :
                                <span>3</span>
                                }
                                </div>
                            {commentDetail.like_count &&
                                <div onClick={()=>handleLikeList()} className="cursor-pointer">
                                    <span>{commentDetail.like_count}</span> {t('likes')}
                                </div>
                            }
                            <div onClick={handleReply} className="cursor-pointer">
                                { t('reply') }
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={handleLikeComment} className="flex items-center cursor-pointer px-2">
                    {commentDetail.is_liked ?
                        <IconHeart active className="size-[16px] text-[#ff3041]"/>
                        :
                        <IconHeart className="size-[12px] md:size-[16px]  text-zinc-400"/>
                    }
                </div>
            </div>
            {!underMd &&
                <UserHoverPreview inComment={true} username={commentDetail.user.username} isHover={isHover} position={userPreviewHoverPosition}/>
            }
            {commentDetail.reply_count &&
                <div onClick={()=> (commentUrl.current && commentDetail.reply_count - (commentDetail.replyList?.length || 0) > 0) ? getReplies() : hideReplies()} className="pl-10 flex items-center gap-4 text-xs text-gray font-semibold cursor-pointer">
                    <span className="w-6 block border-b-[1px] border-[#737373]"></span>
                    {commentUrl.current && commentDetail.reply_count - (commentDetail.replyList?.length || 0) > 0
                        ? 
                        <>
                        <span>View replies ({commentDetail.reply_count - (commentDetail.replyList?.length || 0)})</span>
                        {replyLoading && <IconLoadingButton className="size-4"/>}
                        </>
                        :
                        <span>Hide replies</span>
                    }
                </div>
            }
            {commentDetail.replyList?.map((item,index)=>{
                return <Comment key={index} isReply={true} commentDetail={item}/>
            })}
        </>


    )
}
function getPosition(element : HTMLElement){
    const rect = element.getBoundingClientRect();
    const elmClientHeight = element.clientHeight
    const distanceFromTop = rect.top;
    const distanceFromLeft = rect.left;
    const distanceFromBottom = window.innerHeight - rect.bottom;
    return {left:distanceFromLeft,top:distanceFromTop,height:elmClientHeight,bottom:distanceFromBottom}
}

type userListType = {
    closePopup:()=>void,
    ref:React.Ref<HTMLDivElement> | undefined,
    hoverPreviewRef:React.Ref<HTMLElement> | undefined,
    targetId:string,
    listType:'likeList' | 'followerList' | 'followingList' | 'commentlikeList'
}
export function UserList({closePopup,listType='likeList',ref,hoverPreviewRef,targetId}:userListType){
    const currentUrl = useSelector((state: RootState) => state.popupPost.listUrl);
    const userListData = useSelector((state: RootState) => state.popupPost.userList);
    const underMd = useMediaQuery("(max-width: 768px)");
    const { t } = useTranslation()
    const [isHover,setIsHover] = useState<boolean>(false)
    const [hoveringUsername,setHoveringUsername] = useState<null | string>(null)
    const [userPreviewHoverPosition,setUserPreviewHoverPosition] = useState<{left:number,top:number,bottom:number,height:number}>({left:0,top:0,bottom:0,height:0})
    const dispatch = useDispatch()
    useEffect(()=>{
        if(currentUrl) return
        if(listType == 'likeList'){
            dispatch(changeListUrl(`http://localhost:8000/getpostlikes/${targetId}`))
        }
        else if(listType == 'commentlikeList'){
            dispatch(changeListUrl(`http://localhost:8000/comment/${targetId}/likes`))
        }
        else if(listType == 'followerList'){
            dispatch(changeListUrl(`http://localhost:8000/${targetId}/followers`))
        }
        else{
            dispatch(changeListUrl(`http://localhost:8000/${targetId}/following`))
        }
    },[])
    useEffect(()=>{
        if(!currentUrl) return
            async function fetchData(currentUrl){
                    const response = await fetchSimpleGet(currentUrl)
                    const jsonRes = await response.json()
                    dispatch(addUserList(jsonRes.results))
                }
                fetchData(currentUrl)
    },[currentUrl])
    function mouseEnter(event : React.MouseEvent<Element, MouseEvent>,username:string){
        if(underMd) return
        setHoveringUsername(username)
        setIsHover(true)
        const number = getPosition(event.target as HTMLElement)
        setUserPreviewHoverPosition(number)
        }
    function mouseOut(event : React.MouseEvent<Element, MouseEvent>){
        setTimeout(() => {
            setIsHover(false)
        }, 100);
    }
    return(
        <div className="fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-65">
            <div ref={ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-white rounded-lg flex flex-col">
                <div className="w-full border-b-[1px] border-ss ltr:justify-end relative py-3 flex items-center">
                    <span onClick={closePopup} className="px-2 inline-block cursor-pointer">
                        <IconClose className="size-[18px]"/>
                    </span>
                    <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-semibold">
                    {listType == 'likeList' || listType == 'commentlikeList' ? 
                        <span>
                            {t('like-t')}
                        </span>
                    :
                    <>
                        {listType == 'followerList' ?
                            <span>Followers</span>
                            :
                            <span>Following</span>
                        }
                    </>
                    }
                    </span>
                </div>
                <div className="overflow-y-auto flex-1">
                    {userListData?.map((item,index)=>{
                        return <UserPreview key={index} userData={item} mouseEnter={mouseEnter} mouseOut={mouseOut}/>
                    })}
                </div>
            </div>
            {!underMd &&
                <UserHoverPreview ref={hoverPreviewRef} username={hoveringUsername || ''} isHover={isHover} position={userPreviewHoverPosition}/>
            }
        </div>
    )
}

export function UnfollowPopup({ref,inList=true,isReel=false}:{ref:React.Ref<HTMLElement> | undefined,inList?:boolean,isReel?:boolean}){
    const dispatch = useDispatch()
    const userDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const currentVisitingUser = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    function unfollowHandler(){
        if(isReel){
            dispatch(followPostListUser({username:currentVisitingUser.username,action:'unfollow'}))
        }
        else if(inList){
            dispatch(listToggleIsLoading({username:userDetail?.username,result:true}))
        }
        else{
            dispatch(toggleIsLoading(true))
        }
        dispatch(changeUnfollow(null))
    }
    return(
        <div className="fixed z-50 top-0 right-0 w-[100vw] h-[100vh] bg-black bg-opacity-60 flex justify-center items-center">
            <div ref={ref} className="w-[400px] flex flex-col justify-center items-center bg-white rounded-lg">
                <div className="p-8 flex flex-col items-center justify-center">
                    <div className="size-[90px] overflow-hidden rounded-full mb-4">
                        <Image className="w-full h-full object-cover rounded-full" src={userDetail?.profile_pic || '/images/profile-img.jpeg'} alt="" width={90} height={90}></Image>
                    </div>
                    <span>
                        Unfollow @{userDetail?.username}?
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <div onClick={unfollowHandler} className="border-t-[1px] font-semibold border-ss py-4 text-[#ED4956] cursor-pointer text-center">
                        Unfollow
                    </div>
                    <div onClick={()=>dispatch(changeUnfollow(null))} className="border-t-[1px] border-ss py-4 cursor-pointer text-center">
                        Cancel
                    </div>
                </div>
            </div>            
        </div>
    )
}


export function TaggedPopup({ref,closePopup,sliderCurrentIndex}){
    const postDetail = useSelector((state: RootState)=> state.popupPost.postDetail)
    console.log(sliderCurrentIndex)
    console.log(postDetail.media[sliderCurrentIndex])
    return(
        <div className="fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-65">
            <div ref={ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-h-[400px] bg-white rounded-lg flex flex-col">
                <div className="w-full border-b-[1px] border-ss ltr:justify-end relative py-3 flex items-center">
                    <span onClick={closePopup} className="px-2 inline-block cursor-pointer">
                        <IconClose className="size-[18px]"/>
                    </span>
                    <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-semibold">
                        Tagged
                    </span>
                </div>
                <div className="overflow-y-auto flex-1">
                    {postDetail?.media[sliderCurrentIndex].tagged_users.map((item,index)=>{
                        return(
                            <div key={index} className="py-2 px-4">
                                <div className={`flex ${'gap-2'} items-center`}>
                                    <Link href={`/${item.user.username}`} className={`size-11 rounded-full overflow-hidden flex-shrink-0 relative`}>
                                        <Image className="rounded-full" src={item.user.profile_pic || '/images/profile-img.jpeg'} alt="" width={44} height={44}></Image>
                                    </Link>
                                    <div className={`flex flex-1 flex-col text-sm leading-[18px] relative`}>
                                        <Link className="font-semibold truncate inline-block w-fit" href={`/${item.user.username}`}>
                                            {item.user.username}
                                        </Link>
                                        <span className="text-gray truncate">{item.user.name}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}