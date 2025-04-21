'use client'
import { IconArrow, IconClose } from "./Icons";
import SinglePost from "./SinglePost";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPostDetail, addPostList, changePostListUrl, changeUrl, clearCommentList, clearUserList, remove } from '@/store/slices/postSlice'
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

export function PostPopupSlider(){
    const { t } = useTranslation()
    const popupBoxRef = useRef(null)
    const popupArrowRef = useRef(null)
    const dispatch = useDispatch();
    const popupPost = useSelector((state: RootState)=> state.popupPost.postDetail)
    const postList = useSelector((state: RootState)=> state.popupPost.postList)
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const postListUrl = useSelector((state: RootState) => state.popupPost.postListUrl);
    // const [currentPostIndex,setCurrentPostIndex] = useState<null | number>(null)
    const currentPostIndex = useRef<null | number>(null)
    const [isLastPost,setIsLastPost] = useState(false)
    const [isFirstPost,setIsFirstPost] = useState(false)
    const [shouldFetchPosts,setShouldFetchPosts] = useState(false)
    async function fetchPosts(){
            if(!postListUrl) return
            const response = await fetch(postListUrl, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const jsonRes = await response.json()
            dispatch(addPostList(jsonRes.results))
            dispatch(changePostListUrl(jsonRes.next))
            setShouldFetchPosts(false)
        }
    useEffect(()=>{
        if(!shouldFetchPosts) return
        fetchPosts()
    },[shouldFetchPosts])
    function checkFirstLastIndex(){
        console.log(currentPostIndex.current,postList.length)
        if(currentPostIndex.current == 0){
            setIsFirstPost(true)
        }
        else{
            setIsFirstPost(false)
        }
        if(!postListUrl && currentPostIndex.current == postList.length - 1){
            setIsLastPost(true)
        }
        else{
            setIsLastPost(false)
        }
    }
    useEffect(()=>{
        if(!postUrl) return
        currentPostIndex.current = postList.findIndex((item)=> String(item.id) == postUrl.replace('/p/',''))
        checkFirstLastIndex()
    },[])
    async function fetchPost(){
        const response = await fetch(`http://localhost:8000/getpost/${postUrl?.replace('/p/','')}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const jsonRes = await response.json()
        dispatch(addPostDetail(jsonRes))
        dispatch(clearCommentList())
        dispatch(clearUserList())
    }
    useEffect(()=>{
        if(!postUrl) return
        fetchPost()
    },[postUrl])
    function changeArrow(event,dir:'next' | 'prev'){
        if(!postList) return
        event.preventDefault()
        if(currentPostIndex.current == null) return
        let nextPostId;
        if(dir == 'next'){
            nextPostId = postList[currentPostIndex.current + 1].id
            currentPostIndex.current = currentPostIndex.current + 1
        }
        else{
            nextPostId = postList[currentPostIndex.current - 1].id
            currentPostIndex.current = currentPostIndex.current - 1
        }
        if((postList.length - 1 ) - currentPostIndex.current < 4){
            setShouldFetchPosts(true)
        }
        checkFirstLastIndex()
        dispatch(changeUrl('/p/' + nextPostId))
    }
    return(
        <div className="fixed top-0 left-0 w-full h-full z-50 md:flex justify-center items-center">
            <div className="absolute bg-black bg-opacity-60 w-full h-full top-0 left-0" onClick={()=>dispatch(remove())}>

            </div>
            <span className="text-white absolute top-4 right-4 rtl:right-auto rtl:left-4">
            <IconClose/>
            </span>
            <div className="md:hidden h-11 z-20 flex items-center border-b-[1px] border-ss sticky top-0 bg-white">
                    <span className="px-6 cursor-pointer">
                        <IconArrow className="-rotate-90 rtl:rotate-90"/>
                    </span>
                
                <span className="font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{t('post')}</span>
            </div>
            <div ref={popupBoxRef} className="md:flex w-full md:w-10/12 justify-center lg:w-[900px] relative z-50">
                {popupPost && 
                    <SinglePost isPopup={true}/>
                }
            </div>
            <div ref={popupArrowRef} className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between z-20 px-4">
                    <span onClick={(event)=>!isFirstPost ? changeArrow(event,'prev') : {}} className={`${!isFirstPost && 'bg-white cursor-pointer'} rounded-full w-8 h-8 flex items-center justify-center -rotate-90 rtl:rotate-90`}>
                        {!isFirstPost && 
                            <IconArrow className="size-4"/>
                        }
                    </span>
                <span onClick={(event)=> !isLastPost ? changeArrow(event,'next') : {}} className={`${!isLastPost && 'bg-white cursor-pointer'} rounded-full w-8 h-8 flex items-center justify-center rotate-90 rtl:-rotate-90`}>
                    {!isLastPost &&
                        <IconArrow className="size-4"/>
                    }
                </span>
            </div>
        </div>
    )
}