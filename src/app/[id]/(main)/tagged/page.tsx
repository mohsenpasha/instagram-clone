'use client'
import PostList from "@/components/PostList";
import { addPostList, changePostListUrl, clearPostList } from "@/store/slices/postSlice";
import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TaggedLayout(){
    const postList = useSelector((state: RootState) => state.popupPost.postList);
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const currentUser = useSelector((state: RootState)=> state.currentUser.currentVisitingUser)
    const postListUrl = useSelector((state: RootState) => state.popupPost.postListUrl);
    const [isLoading,setIsLoading] = useState(false)
    const hasFetchedPostFirstTime = useRef(false);
    const dispatch = useDispatch()
    const newUrl = useRef('http://localhost:8000/tagged/' + currentUser.username)
    async function fetchPosts(){
            if(hasFetchedPostFirstTime.current && !postListUrl) return
            if(!newUrl.current) return
            const response = await fetch(hasFetchedPostFirstTime.current ? postListUrl : newUrl.current, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const jsonRes = await response.json()
            dispatch(addPostList(jsonRes.results))
            dispatch(changePostListUrl(jsonRes.next))
            setIsLoading(false);
        }
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !isLoading) {
            setIsLoading(true)
        }
        };
    useEffect(()=>{
        dispatch(clearPostList())
        setIsLoading(true)
        dispatch(changePostListUrl(`http://localhost:8000/tagged/${currentUser.username}`))
        if(!currentUser.is_private && !hasFetchedPostFirstTime.current){
            hasFetchedPostFirstTime.current = true
            window.addEventListener("scroll", handleScroll);
            // return () => window.removeEventListener("scroll", handleScroll);
        }
    },[])
    useEffect(()=>{
        },[])
    useEffect(()=>{
        if(!isLoading) return
        fetchPosts()
    },[isLoading])
    return(
        <>
            <PostList postList={postList} isReel={false} />
        </>
    )
}