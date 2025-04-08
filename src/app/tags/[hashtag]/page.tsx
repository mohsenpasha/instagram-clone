'use client'

import { fetchSimpleGet } from "@/api/simpleGet"
import { IconLoading } from "@/components/Icons"
import PostList from "@/components/PostList"
import { addPostList } from "@/store/slices/postSlice"
import { RootState } from "@/store/store"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function HashtagPage(){
    const postList = useSelector((state: RootState)=> state.popupPost.postList)
    const params = useParams()
    const hashtag = decodeURIComponent(params.hashtag)
    const [isLoading,setIsLoading] = useState(false)
    const nextUrl = useRef('http://localhost:8000/hashtag/'+hashtag)
    const dispatch = useDispatch()
    async function fetchPosts(){
        const response = await fetchSimpleGet(nextUrl.current)
        const jsonRes = await response.json()
        nextUrl.current = jsonRes.next
        dispatch(addPostList(jsonRes.results))
        console.log(jsonRes.results)
        setIsLoading(false)
    }
    useEffect(()=>{
        setIsLoading(true)
        window.addEventListener("scroll", handleScroll);
    },[])
    useEffect(()=>{
        if(!isLoading) return
        fetchPosts()
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
            {isLoading && 
                <div className="w-full flex justify-center p-4">
                    <IconLoading className="size-8 fill-[#555555]" />
                </div>
            }
        </>
    )
}