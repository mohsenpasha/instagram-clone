 'use client'
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { IconAdd, IconDirect, IconExplore, IconHeart, IconHome, IconInstagram, IconMenu, IconReels, IconSearch} from "./Icons";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { isSea } from "node:sea";
import { useAnimationEnd } from "@/hooks/useAnimationEnd";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleSearch } from "@/store/slices/searchSlice";
export default function SideBar({isAlwaysMinimal}:{isAlwaysMinimal?:boolean}){
    const isSearchCloseAnimationStarted = useSelector((state: RootState) => state.searchInfo.isSearchCloseAnimationStarted)
    const [isSearchActive,setIsSearchActive] = useState(false)
    const dispatch = useDispatch()
    const [isMinimal,setIsMinimal] = useState(false)
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
    function SearchBarToggle(){
        if(isSearchActive){
            dispatch(toggleSearch(true))
        }
        else{
            setIsSearchActive(true)
        }
        if(!isAlwaysMinimal){
            setIsMinimal(!isMinimal)
        }
    }
    useClickOutside(searchRef, () => SearchBarToggle());
    return(
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
                <ul className="flex w-full justify-around md:block">
                    {/* <button onClick={() => i18n.changeLanguage("fa")}>فارسی</button>
                    <button onClick={() => i18n.changeLanguage("en")}>English</button> */}

                    <li>
                        <Link title={t('home')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconHome className={'shrink-0'}/>
                            {!isMinimal &&
                            <span className="hidden xl:inline-block">{t('home')}</span>
                            }
                        </Link>
                    </li>
                    <li className="hidden md:block">
                        <div onClick={SearchBarToggle} title={t('search')} className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconSearch className={'shrink-0'}/>
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('search')}</span>
                            }
                        </div>
                    </li>
                    <li>
                        <Link title={t('explore')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconExplore className={'shrink-0'} />
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('explore')}</span>
                            }
                        </Link>
                    </li>
                    <li>
                        <Link title={t('reels')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconReels className={'shrink-0'} />
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('reels')}</span>
                            }
                        </Link>
                    </li>
                    <li className="block md:hidden">
                        <Link title={t('create')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconAdd className={'shrink-0'}/>
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('create')}</span>
                            }
                        </Link>
                    </li>
                    <li>
                        <Link title={t('direct')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconDirect className={'shrink-0'} />
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('direct')}</span>
                            }
                        </Link>
                    </li>
                    <li className="hidden md:block">
                        <Link title={t('notification')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconHeart className={'shrink-0'}/>
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('notification')}</span>
                            }
                        </Link>
                    </li>
                    <li className="hidden md:block">
                        <Link title={t('create')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconAdd className={'shrink-0'} />
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('create')}</span>
                            }
                        </Link>
                    </li>
                    <li>
                        <Link title={t('profile')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <IconAdd className={'shrink-0'} />
                            {!isMinimal &&
                                <span className="hidden xl:inline-block">{t('profile')}</span>
                            }
                        </Link>
                    </li>
                </ul>
                <div title={t('menu')} className="hidden md:flex gap-4 p-0 md:p-[12px] my-[10px] mt-16 rounded-lg hover:bg-zinc-100 transition-all
 cursor-pointer">
                    <IconMenu className={'shrink-0'} />
                    {!isMinimal &&
                        <span className="hidden xl:inline-block">{t('menu')}</span>
                    }
                </div>
            </div>

        </div>
    )
}