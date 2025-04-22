'use client'
import { fetchSimpleGet } from "@/api/simpleGet";
import { ReelScroll } from "@/components/Reel";
import { addPostList, changePostListUrl, clearPostList } from "@/store/slices/postSlice";
import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ReelPage(){
    const dispatch = useDispatch()
    const postListUrl = useSelector((state: RootState) => state.popupPost.postDetail);
    const hasFetchedPostFirstTime = useRef(false)
    const nextUrl = useRef('http://localhost:8000/reels')

    async function fetchPosts(){
            const response = await fetchSimpleGet(hasFetchedPostFirstTime.current ? postListUrl : nextUrl.current)
            const jsonRes = await response.json()
            dispatch(changePostListUrl(jsonRes.next))
            dispatch(addPostList(jsonRes.results))
            nextUrl.current = jsonRes.next
        }
    useEffect(()=>{
        dispatch(clearPostList())
        fetchPosts()
    },[])
    return(
        <div className="flex justify-center w-full md:w-10/12 xl:10/12">
            <ReelScroll/>
        </div>
    )
}