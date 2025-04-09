'use client'

import { fetchSimpleGet } from "@/api/simpleGet"
import { IconLoading } from "@/components/Icons"
import PostList from "@/components/PostList"
import { PostPopupSlider } from "@/components/PostPopupSlider"
import { addPostList, changePostListUrl, clearPostList } from "@/store/slices/postSlice"
import { RootState } from "@/store/store"
import { current } from "@reduxjs/toolkit"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function HashtagPage(){
    const postList = useSelector((state: RootState)=> state.popupPost.postList)
    const postUrl =  useSelector((state: RootState)=> state.popupPost.url)
    const params = useParams()
    const hashtag = decodeURIComponent(params.hashtag)
    const [isLoading,setIsLoading] = useState(false)
    const nextUrl = useRef('http://localhost:8000/hashtag/'+ hashtag)
    const postListUrl = useSelector((state: RootState)=> state.popupPost.postListUrl)
    const hasFetchedPostFirstTime = useRef(false);
    const dispatch = useDispatch()
    async function fetchPosts(){
        const response = await fetchSimpleGet(hasFetchedPostFirstTime.current ? postListUrl : nextUrl.current)
        const jsonRes = await response.json()
        dispatch(changePostListUrl(jsonRes.next))
        dispatch(addPostList(jsonRes.results))
        nextUrl.current = jsonRes.next
        setIsLoading(false)
    }
    useEffect(()=>{
        dispatch(clearPostList())
        dispatch(changePostListUrl('http://localhost:8000/hashtag/'+ hashtag))
        setIsLoading(true)
        window.addEventListener("scroll", handleScroll);
    },[])
    useEffect(()=>{
        if(!isLoading) return
        fetchPosts()
        hasFetchedPostFirstTime.current = true
    },[isLoading])

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !isLoading) {
            if(!nextUrl.current) return
            setIsLoading(true)
        }
      };
    return(
        <>
            <div dir="ltr" className="text-xl pt-12 pb-3 font-semibold">#{hashtag}</div>
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