'use client'
import PostList from "@/components/PostList";
import SinglePost from "@/components/SinglePost";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export default function PostPage(){
    const { t } = useTranslation();
    return(
        <div className={`flex flex-wrap justify-center [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${!pageScroll && 'overflow-hidden w-screen h-screen'}`}>
            <div className="flex w-full md:w-11/12 lg:10/12 justify-center">
                <div className="w-full md:px-4 xl:px-0 lg:w-10/12 xl:w-8/12">
                    <SinglePost/>
                </div>
            </div>
            <div className="flex justify-center w-full md:w-11/12 lg:10/12">
                <div className="w-full md:px-4 xl:px-0 lg:w-11/12 xl:w-9/12 md:border-t-[1px] pt-4 border-ss mb-[50px]">
                    <div className="py-4">
                        <span className="text-gray">{t('morepf')}</span>
                        <Link className="mx-1 hover:text-zinc-400" href='afshin_bizar'>afshin_bizar</Link>
                    </div>
                    <PostList isReel={false}/>
                </div>
            </div>
        </div>
    )
}