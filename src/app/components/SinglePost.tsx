import Image from "next/image";
import { IconArrow, IconClose, IconComment, IconDirect, IconEmoji, IconHeart, IconLoading, IconMore, IconSave } from "./Icons";
import { useTranslation } from "next-i18next";
import React, { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { UserPreview } from "./UserPreview";
import UserHoverPreview from "./UserHoverPreview";
import { disableScroll, enableScroll } from "@/utils/scroll";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector,useDispatch } from "react-redux";
import { likePost, savePost, unlikePost, unsavePost, addUserList, listToggleIsLoading, clearUserList, changeListUrl } from '@/store/slices/postSlice'
import { fetchGetPostLikeList, fetchLikePost, fetchUnlikePost } from "@/api/likesApi";
import { fetchSavePost, fetchUnsavePost } from "@/api/saveApi";
import { RootState } from "@/store/store";
import { changeUnfollow, toggleIsLoading } from "@/store/slices/userSlice";
import useMediaQuery from "@/hooks/useMediaQuery";


export default function SinglePost({isPopup}:{isPopup:boolean}){
    const dispatch = useDispatch()
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const [userPreviewHoverPosition,setUserPreviewHoverPosition] = useState<{left:number,top:number,bottom:number,height:number}>({left:0,top:0,bottom:0,height:0})
    const [commentToggle,setCommentToggle] = useState<boolean>(false)
    const [likeBoxToggle,setLikeBoxToggle] = useState<boolean>(false)
    const [isHover,setIsHover] = useState<boolean>(false)
    const underMd = useMediaQuery("(max-width: 768px)");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const likeBoxRef = useRef<HTMLElement | null>(null)
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    useClickOutside(likeBoxRef, () => !unfollowDetail ? setLikeBoxToggle(false) : {});
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    const { t } = useTranslation();
    function mouseEnter(event : React.MouseEvent<Element, MouseEvent>){
        setIsHover(true)
        const number = getPosition(event.target as HTMLElement)
        setUserPreviewHoverPosition(number)
        }
    function mouseOut(event : React.MouseEvent<Element, MouseEvent>){
        setTimeout(() => {
            setIsHover(false)
        }, 100);
    }
    useEffect(()=>{
        if(likeBoxToggle){
            disableScroll()
        }
        else{
            dispatch(changeListUrl(null))
            dispatch(clearUserList())
            enableScroll()
        }
    },[likeBoxToggle])
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
        console.log(textareaRef.current)
    }
    return(
        <>
            <div className={`bg-white flex border-[1px] border-ss relative pb-12 md:pb-0 md:h-[85vh] ${isPopup && 'md:max-w-max'} flex-wrap md:flex-nowrap`}>
                <div className="relative mt-[70px] md:mt-0 w-full md:w-1/2">
                    <Image
                        src={postDetail.media[0].file}
                        alt="Sample"
                        width={1080}
                        height={1080}
                        className="object-cover w-full h-full static"
                    />
                </div>
                <div className="flex-1 flex flex-col h-full">
                    <div className="flex items-center absolute md:static top-0 right-0 w-full">
                        <div className="flex h-[70px] md:h-auto items-center gap-2 px-[16px] py-[14px] w-full border-b-[1px] md:border-b-0 border-ss justify-between">
                            <div className="flex gap-2 w-11/12 sm:w-10/12 truncate items-center">
                                <div onMouseEnter={mouseEnter} onMouseOut={mouseOut} className="rounded-full cursor-pointer size-8 overflow-hidden">
                                    <Image className="rounded-full" src={postDetail.user.profile_pic || '/images/profile-img.jpeg'} width={32} height={32} alt=""></Image>
                                </div>
                                <div className="w-9/12 sm:w-11/12 md:w-9/12">
                                    <div onMouseEnter={mouseEnter} onMouseOut={mouseOut} className="text-sm font-medium inline-block">
                                        {postDetail.user.username}
                                    </div>
                                    <div className="text-xs truncate">
                                        Dariu$h, Saeed Dehghan • Jadid Free$Tyle
                                    </div>
                                </div>
                            </div>
                            <div>
                                <IconMore className="cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                            
                        <PostCaption caption={postDetail.caption} user={postDetail.user} />
                        {underMd 
                        ? 
                        commentToggle && <CommentBox textareaRef={textareaRef} closeCommentBox={handleCommentToggle} />
                        :
                        <>
                            <CommentBox textareaRef={textareaRef}/>
                        </>
                        }
                    </div>
                    <div className="px-2">
                        <PostAction handleCommentToggle={handleCommentToggle} />
                        <div onClick={()=>setLikeBoxToggle(true)} className="mx-2 font-bold text-sm cursor-pointer">
                            <span>{postDetail.like_count}</span> {t('likes')}
                        </div>
                        <div onClick={handleCommentToggle} className="block mx-2 md:hidden text-gray text-sm cursor-pointer">
                            {t('view-all')} <span>23</span> {t('cs')}
                        </div>
                        <div className="mx-2 text-xs cursor-pointer text-gray m-2">
                            1 {t('day-ago')}
                        </div>
                        <CommentInput textareaRef={textareaRef} className="hidden md:flex" />
                    </div>
                </div>
                {likeBoxToggle && 
                    <UserList targetId={postDetail.id} ref={likeBoxRef} closePopup={()=>setLikeBoxToggle(false)} />
                }
                {!underMd &&
                    <UserHoverPreview isHover={isHover} position={userPreviewHoverPosition}/>
                }
            </div>
            {unfollowDetail &&
                <UnfollowPopup ref={unfollowPopupRef}/>
            }
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
export function PostCaption({caption,user}){
    return(
        <div className="flex justify-between py-3 px-2 md:px-0 ltr:md:pl-6 rtl:md:pr-6">
        <div className="flex gap-2">
            <div className="rounded-full flex-shrink-0 cursor-pointer size-8 overflow-hidden">
                <Image className="rounded-full" src={user.profile_pic || '/images/profile-img-2.jpg'} width={32} height={32} alt=""></Image>
            </div>
            <div className="flex-col md:flex">
                <div className="block">
                    <div className="text-sm pr-1 rtl:pr-0 rtl:pl-1 inline mr-1 md:mr-0 font-medium float-left rtl:float-right">
                        {user.username}
                    </div>
                    <div className="text-sm whitespace-break-spaces">
                        <span className="leading-3">
                            {caption}
                        </span>
                    </div>
                </div>
                <div className="text-xs text-gray flex gap-2 font-medium mt-2">
                            <div className="font-normal"><span>3</span>d</div>
                        </div>
            </div>
        </div>
        <div className="flex items-center cursor-pointer px-2">
            
        </div>
    </div>
    )
}
export function CommentInput({className,textareaRef} : {className?:string,textareaRef:RefObject<HTMLTextAreaElement | null>}){
    const [value, setValue] = useState<string>("");
    const [emojiBottom,setEmojiBottom] = useState<boolean>(false)
    const [emojiBoxToggle,setEmojiBoxToggle] = useState<boolean>(false)
    const emojiBoxRef = useRef<HTMLDivElement>(null);
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
            <span>Post</span>
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


export function CommentBox({closeCommentBox,textareaRef}:{closeCommentBox?:()=>void,textareaRef:RefObject<HTMLTextAreaElement | null>}){
    const [likeBoxToggle,setLikeBoxToggle] = useState<boolean>(false)
    const { t } = useTranslation()
    const likeBoxRef = useRef<HTMLElement>(null)
    useClickOutside(likeBoxRef, () => setLikeBoxToggle(false));
    useEffect(()=>{
        if(likeBoxToggle){
            disableScroll()
        }
        else{
            enableScroll()
        }
    },[likeBoxToggle])
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
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
                <Comment showLikeList={()=>setLikeBoxToggle(true)} />
            </div>
            <CommentInput textareaRef={textareaRef} className="bg-white fixed pb-20 pt-8 bottom-0 left-0 w-full mx-0 p-4 flex md:hidden" />
        </div>
        {likeBoxToggle && 
            <UserList ref={likeBoxRef} closePopup={()=>setLikeBoxToggle(false)} />
        }
        </>
    )
}
function Comment({showLikeList}:{showLikeList?:()=>void}){
    
    const { t } = useTranslation()
    return(
        <div className="flex justify-between py-3 px-2 md:px-0">
            <div className="flex gap-2">
                <div className="rounded-full flex-shrink-0 cursor-pointer size-8">
                    <Image className="rounded-full" src='/images/profile-img-2.jpg' width={32} height={32} alt=""></Image>
                </div>
                <div className="flex-col md:flex">
                    <div className="block">
                        <div className="text-sm pr-1 rtl:pr-0 rtl:pl-1 inline mr-1 md:mr-0 font-medium float-left rtl:float-right">
                            afshin_bizar
                        </div>
                        <div className="text-sm whitespace-break-spaces">
                            <span className="leading-3">
                                    چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود چقدر کسشعر بود 
                            </span>
                        </div>
                    </div>
                    <div className="text-xs text-gray flex gap-2 font-medium mt-2">
                        <div className="font-normal"><span>3</span>d</div>
                        <div onClick={()=>showLikeList()} className="cursor-pointer">
                            <span>1</span> {t('likes')}
                        </div>
                        <div className="cursor-pointer">
                            { t('reply') }
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center cursor-pointer px-2">
                <IconHeart className="size-[12px] md:size-[16px]  text-zinc-400"/>
                {/* <IconHeart active className="size-[16px] text-red-600"/> */}
            </div>
        </div>


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
    isComment:boolean,
    targetId:string,
    listType:'likeList' | 'followerList' | 'followingList'
}
export function UserList({closePopup,listType='likeList',ref,isComment=false,targetId}:userListType){
    const currentUrl = useSelector((state: RootState) => state.popupPost.listUrl);
    const userListData = useSelector((state: RootState) => state.popupPost.userList);
    const underMd = useMediaQuery("(max-width: 768px)");
    console.log('underMd')
    console.log(underMd)
    console.log('underMd')
    const { t } = useTranslation()
    const [isHover,setIsHover] = useState<boolean>(false)
    const [hoveringUsername,setHoveringUsername] = useState<null | string>(null)
    const [userPreviewHoverPosition,setUserPreviewHoverPosition] = useState<{left:number,top:number,bottom:number,height:number}>({left:0,top:0,bottom:0,height:0})
    const dispatch = useDispatch()
    useEffect(()=>{
        if(listType == 'likeList'){
            dispatch(changeListUrl(`http://localhost:8000/getpostlikes/${targetId}`))
        }
        else if(listType == 'followerList'){
            dispatch(changeListUrl(`http://localhost:8000/${targetId}/followers`))
        }
        else{
            dispatch(changeListUrl(`http://localhost:8000/${targetId}/following`))
        }
    },[])
    useEffect(()=>{
        console.log(currentUrl)
        if(!currentUrl) return
            if(!isComment){
                async function fetchData(currentUrl){
                        const response = await fetchGetPostLikeList(currentUrl)
                        const jsonRes = await response.json()
                        dispatch(addUserList(jsonRes.results))
                    }
                    fetchData(currentUrl)
            }
            else{
                console.log('outside')
            }
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
                    {listType == 'likeList' ? 
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
                <div className="overflow-y-scroll flex-1">
                    {userListData?.map((item,index)=>{
                        return <UserPreview key={index} userData={item} mouseEnter={mouseEnter} mouseOut={mouseOut}/>
                    })}
                </div>
            </div>
            {!underMd && isHover &&
                <UserHoverPreview ref={ref} username={hoveringUsername} isHover={isHover} position={userPreviewHoverPosition}/>
            }
        </div>
    )
}

export function UnfollowPopup({ref,inList=true}){
    const dispatch = useDispatch()
    const userDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    function unfollowHandler(){
        if(inList){
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
                        <IconLoading className="size-8 fill-[#555555]"/>
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