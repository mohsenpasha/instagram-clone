'use client'
import Image from "next/image";
import { useTranslation } from "next-i18next";
import i18n  from '@/../../i18n'
import Link from "next/link";
export default function SideBar(){
    const { t } = useTranslation();
    i18n.changeLanguage("fa")
    console.log(t('menu'))
    return(
        <div className="fixed w-full h-fit bottom-0 md:sticky md:top-0 bg-white px-[12px] py-[2px] md:py-[8px] md:pb-[20px] border-t-[1px] md:border-t-0 md:border-x-[1px] border-s md:w-fit xl:w-2/12 md:h-screen">
            <div className="flex flex-col justify-between h-full">
            <div className="hidden md:block p-[12px] pt-[25px] pb-[16px]">
                <Image className="hidden xl:block w-28" src='images/instagram.svg' alt="" width={500} height={300} />
                <Image className="block xl:hidden" src='images/s-instagram.svg' alt="" width={24} height={24} />
            </div>

                <ul className="flex w-full justify-around md:block">
                    {/* <button onClick={() => i18n.changeLanguage("fa")}>فارسی</button>
                    <button onClick={() => i18n.changeLanguage("en")}>English</button> */}

                    <li>
                        <Link title={t('home')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/home.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('home')}</span>
                        </Link>
                    </li>
                    <li className="hidden md:block">
                        <Link title={t('search')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/search.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('search')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link title={t('explore')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/explore.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('explore')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link title={t('reels')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/reel.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('reels')}</span>
                        </Link>
                    </li>
                    <li className="block md:hidden">
                        <Link title={t('create')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/new-post.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('create')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link title={t('direct')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/direct.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('direct')}</span>
                        </Link>
                    </li>
                    <li className="hidden md:block">
                        <Link title={t('notification')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/heart.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('notification')}</span>
                        </Link>
                    </li>
                    <li className="hidden md:block">
                        <Link title={t('create')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/new-post.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('create')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link title={t('profile')} href="#" className="flex gap-4 p-0 md:p-[12px] my-[10px] rounded-lg hover:bg-zinc-100 transition-all
">
                            <Image src='images/new-post.svg' alt="" width={24} height={24}></Image>        
                            <span className="hidden xl:inline-block">{t('profile')}</span>
                        </Link>
                    </li>
                </ul>
                <div title={t('menu')} className="hidden md:block flex gap-4 p-0 md:p-[12px] my-[10px] mt-16 rounded-lg hover:bg-zinc-100 transition-all
 cursor-pointer">
                    <Image src='images/menu.svg' alt="" width={24} height={24}></Image>        
                    <span className="hidden xl:inline-block">{t('menu')}</span>
                </div>
            </div>

        </div>
    )
}