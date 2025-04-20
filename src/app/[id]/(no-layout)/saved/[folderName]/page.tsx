'use client'

import { fetchSimpleGet } from "@/api/simpleGet"
import { IconArrow, IconLoading } from "@/components/Icons"
import PostList from "@/components/PostList"
import { PostPopupSlider } from "@/components/PostPopupSlider"
import { addPostList, changePostListUrl, clearPostList } from "@/store/slices/postSlice"
import { RootState } from "@/store/store"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

export default function SavedFolderPage(){
    const postList = useSelector((state: RootState)=> state.popupPost.postList)
    const postUrl =  useSelector((state: RootState)=> state.popupPost.url)
    const params = useParams()
    const folderName = decodeURIComponent(params.folderName)
    const [isLoading,setIsLoading] = useState(false)
    const { t } = useTranslation()
    return(
        <>
            <Link className="text-gray flex items-center mt-6 gap-1" href={'../saved'}>
                <IconArrow className="size-6 text-gray rotate-90"/>
                <span>{t('saved')}</span>
            </Link>
            <div className="text-xl pt-2 pb-3 font-semibold">{folderName == 'all-posts' ? t('allposts') : folderName}</div>
            <PostList isHoverPreview={true} postList={postList} isReel={false} />
            {postUrl && 
                <PostPopupSlider/>
            }
            {isLoading && 
                <div className="w-full flex justify-center p-4">
                    <IconLoading className="size-8 fill-[#555555]" />
                </div>
            }
        </>
    )
}