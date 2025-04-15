 'use client'
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { IconAdd, IconDirect, IconExplore, IconHeart, IconHome, IconInstagram, IconMenu, IconReels, IconSearch} from "./Icons";
import SearchBar from "./SearchBar";
import { useEffect, useRef, useState } from "react";
import { isSea } from "node:sea";
import { useAnimationEnd } from "@/hooks/useAnimationEnd";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleSearch } from "@/store/slices/searchSlice";
import { addNotification, toggleNotification } from "@/store/slices/notificationSlice";
import NotificationBar from "./NotificationBar";
import CreatePostPopup from "./PostCreate";
export default function SideBar({isAlwaysMinimal}:{isAlwaysMinimal?:boolean}){
    const isSearchCloseAnimationStarted = useSelector((state: RootState) => state.searchInfo.isSearchCloseAnimationStarted)
    const isNotificationCloseAnimationStarted = useSelector((state: RootState) => state.notificationInfo.isNotificationCloseAnimationStarted)
    const notificationList = useSelector((state: RootState) => state.notificationInfo.notificationList)
    const [isSearchActive,setIsSearchActive] = useState(false)
    const [isNotificationActive,setIsNotificationActive] = useState(false)
    const dispatch = useDispatch()
    const [isMinimal,setIsMinimal] = useState(false)
    const [newNotificationCount,setNewNotificationCount] = useState(0)
    const [toggleCreatePost,setToggleCreatePost] = useState(false)
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/`);
    socketRef.current = socket;
    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.notifications)
        if(data.notifications){
            dispatch(addNotification(data.notifications))
        }
        else{
            dispatch(addNotification(data.notification))
        }

    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  },[]);
    useEffect(()=>{
        if(notificationList.length == 0) return
        let counter = 0
        notificationList.map((item)=>{
            if(!item.is_read){
                counter += 1 
            }
        })
        setNewNotificationCount(counter)
    },[notificationList])
    useEffect(()=>{
        if(isAlwaysMinimal){
            setIsMinimal(true)
        }
        
    },[])
    const { t } = useTranslation();
    const searchRef = useAnimationEnd(() => {
        if(isSearchCloseAnimationStarted){
            setIsSearchActive(false)
            dispatch(toggleSearch(false))
        }
    });
    const NotificationRef = useAnimationEnd(() => {
        if(isNotificationCloseAnimationStarted){
            setIsNotificationActive(false)
            dispatch(toggleNotification(false))
        }
    });
    function SearchBarToggle(doMinimal=true){
        console.log(doMinimal)
        if(isNotificationActive){
            notificationBarToggle(false)
        }
        if(!isAlwaysMinimal && doMinimal){
            setIsMinimal(!isMinimal)
        }
        if(isSearchActive){
            dispatch(toggleSearch(true))
        }
        else{
            setIsSearchActive(true)
        }
    }
    function notificationBarToggle(doMinimal=true){
        console.log(doMinimal)
        if(isSearchActive){
            SearchBarToggle(false)
        }
        if(!isAlwaysMinimal && doMinimal){
            setIsMinimal(!isMinimal)
        }
        if(isNotificationActive){
            dispatch(toggleNotification(true))
        }
        else{
            setIsNotificationActive(true)
        }
    }
    useClickOutside(searchRef, () => SearchBarToggle());
    useClickOutside(NotificationRef, () => notificationBarToggle());
    return(
        <>
            <div className={`${isMinimal ? 'md:w-[74px] w-full' : 'w-full md:w-fit xl:w-2/12'} transition-all duration-300 fixed z-50 h-fit bottom-0 md:sticky md:top-0 bg-white px-[12px] py-[2px] md:py-[8px] md:pb-[20px] border-t-[1px] md:border-t-0 md:border-x-[1px] border-ss md:h-screen`}>
                <div className="flex flex-col justify-between h-full">
                <div className="hidden md:block p-[12px] pt-[25px] pb-[16px]">

                    {!isMinimal &&
                        <Image className="hidden xl:block w-28" src='/images/instagram.svg' alt="" width={500} height={300} />
                    }
                    <IconInstagram className={`${isMinimal ? 'block' : 'block xl:hidden'}`}/>
                </div>
                    {isSearchActive &&
                        <SearchBar ref={searchRef} closeAnimationStat={isSearchCloseAnimationStarted}/>
                    }
                    {isNotificationActive && 
                        <NotificationBar ref={NotificationRef} closeAnimationStat={isNotificationCloseAnimationStarted}/>
                    }
                    <ul className="flex w-full justify-around md:block">
                        {/* <button onClick={() => i18n.changeLanguage("fa")}>فارسی</button>
                        <button onClick={() => i18n.changeLanguage("en")}>English</button> */}

                        <li>
                            <Link title={t('home')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                <IconHome className={'shrink-0'}/>
                                {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('home')}</span>
                            }
                            </Link>
                        </li>
                        <li className="hidden md:block">
                            <div onClick={()=>SearchBarToggle(!isNotificationActive)} title={t('search')} className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                <IconSearch className={'shrink-0'}/>
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('search')}</span>
                                }
                            </div>
                        </li>
                        <li>
                            <Link title={t('explore')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                <IconExplore className={'shrink-0'} />
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('explore')}</span>
                                }
                            </Link>
                        </li>
                        <li>
                            <Link title={t('reels')} href="/reels/" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                <IconReels className={'shrink-0'} />
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('reels')}</span>
                                }
                            </Link>
                        </li>
                        <li className="block md:hidden">
                            <div title={t('create')} onClick={()=>setToggleCreatePost(true)} className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all cursor-pointer">
                                <IconAdd className={'shrink-0'}/>
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('create')}</span>
                                }
                            </div>
                        </li>
                        <li>
                            <Link title={t('direct')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                <IconDirect className={'shrink-0'} />
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('direct')}</span>
                                }
                            </Link>
                        </li>
                        <li className="hidden md:block">
                            <div onClick={()=>notificationBarToggle(!isSearchActive)} title={t('notification')} className="relative flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                {newNotificationCount != 0 && 
                                    <UnSeenCounter counter={newNotificationCount}/>
                                }
                                <IconHeart className={'shrink-0'}/>
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('notification')}</span>
                                }
                            </div>
                        </li>
                        <li className="hidden md:block">
                            <div title={t('create')} onClick={()=>setToggleCreatePost(true)} className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all cursor-pointer">
                                <IconAdd className={'shrink-0'} />
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('create')}</span>
                                }
                            </div>
                        </li>
                        <li>
                            <Link title={t('profile')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all">
                                <IconAdd className={'shrink-0'} />
                                {!isMinimal &&
                                    <span className="hidden xl:inline-block">{t('profile')}</span>
                                }
                            </Link>
                        </li>
                    </ul>
                    <div title={t('menu')} className="hidden md:flex gap-4 p-0 md:p-[12px] my-[10px] mt-16 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer">
                        <IconMenu className={'shrink-0'} />
                        {!isMinimal &&
                            <span className="hidden xl:inline-block">{t('menu')}</span>
                        }
                    </div>
                </div>
            </div>
            {toggleCreatePost &&
                <CreatePostPopup closeHandler={()=>setToggleCreatePost(false)} />
            }
        </>
    )
}


export function UnSeenCounter({counter}:{counter:number}){
    return(
        <span className="absolute bg-[#FF3040] size-5 rounded-full text-white flex items-center justify-center right-0 top-1 border-[1px] border-white text-[11px]">
            {counter}
        </span>
    )
}