'use client'

import PostList from "@/components/PostList"
import SinglePost from "@/components/SinglePost"
import { useEffect, useRef, useState } from "react"
import { useParams } from 'next/navigation'
import { PostPopupSlider } from "@/components/PostPopupSlider"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { disableScroll, enableScroll } from "@/utils/scroll"

export default function Profile(){
    const router = useRouter();
    const popupPost = useSelector((state: RootState) => state.popupPost.value);
    const dispatch = useDispatch();
    const params = useParams()
    const postRef = useRef(`http://localhost:8000/${params.id}/posts`)
    const [postList,setPostList] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    async function fetchPosts(){
        const response = await fetch(postRef.current, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const jsonRes = await response.json()
        postRef.current = jsonRes.next
        setPostList((prevPosts) => [...prevPosts, ...jsonRes.results]);
        setIsLoading(false);
    }
    useEffect(()=>{
        console.log('startup shit')
        fetchPosts()
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    },[])
    useEffect(()=>{
        console.log(popupPost)
        if(popupPost){
            disableScroll()
        }
        else{
            console.log('enable scroll')
            enableScroll()
        }
    },[popupPost])
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !isLoading) {
        if(postRef.current){
            console.log(postRef)
            setIsLoading(true)
        }
      }
    };

    useEffect(() => {
        if(isLoading){
            fetchPosts()
        }
      }, [isLoading]);

    return(
        <>
            <PostList postList={postList} isReel={false} />
            {popupPost && 
                <PostPopupSlider/>
            }

        </>
    )
}