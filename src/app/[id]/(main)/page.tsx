'use client'

import PostList from "@/components/PostList"
import { useEffect, useRef, useState } from "react"
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IconCamera, IconPrivatePage } from "@/components/Icons"
import { FollowBtn } from "@/components/FollowBtn"
import { addPostList, changePostListUrl, clearPostList } from "@/store/slices/postSlice"
import { useTranslation } from "react-i18next";

export default function Profile(){
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const postList = useSelector((state: RootState) => state.popupPost.postList);
    const postListUrl = useSelector((state: RootState) => state.popupPost.postListUrl);
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const hasFetchedPostFirstTime = useRef(false);
    const dispatch = useDispatch();
    const params = useParams()
    const postRef = useRef(`http://localhost:8000/${params.id}/posts`)
    const [isLoading, setIsLoading] = useState(false);
    async function fetchPosts(){
        if(hasFetchedPostFirstTime.current && !postListUrl) return
        if(!postRef.current) return
        const response = await fetch(hasFetchedPostFirstTime.current ? postListUrl : postRef.current, {
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
    useEffect(()=>{
        dispatch(clearPostList())
        dispatch(changePostListUrl(`http://localhost:8000/${params.id}/posts`))
        if(!userInfo.is_private && !hasFetchedPostFirstTime.current){
            fetchPosts()
            hasFetchedPostFirstTime.current = true
            window.addEventListener("scroll", handleScroll);
            // return () => window.removeEventListener("scroll", handleScroll);
        }
    },[])
    
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !isLoading) {
        setIsLoading(true)
      }
    };

    useEffect(() => {
        if(isLoading){
            fetchPosts()
        }
      }, [isLoading]);
      if(!userInfo) return
    return(
        <>
        {userInfo.is_private ?
        <div className="flex flex-col justify-center items-center gap-4">
            <PrivatePage/>
            <FollowBtn className="w-11/12 md:w-auto text-sm md:text-base" haveIcon={false} inList={false} userData={userInfo}/>
        </div>
        :
        <>
            {!userInfo.post_count ? 
                <NoPost/>
                :
                <>
                <PostList postList={postList} isReel={false} />
                </>
            }
        </>
        }

        </>
    )
}

export function PrivatePage(){
    const { t } = useTranslation();
    return(
        <div className="w-full flex justify-center items-center pt-6">
            <div className="flex w-fit gap-2 items-center">
                <IconPrivatePage/>
                <div className="flex flex-col gap-[2px] text-sm">
                    <span className="font-semibold">{t('privateaccount')}</span>
                    <span className="text-gray">{t('privateaccounttext')}</span>
                </div>
            </div>
        </div>
    )
}

export function NoPost(){
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const { t } = useTranslation();
    return(
        <div className="w-full flex justify-center items-center md:my-14 md:p-0 p-2 border-t-[1px] border-b-[1px] border-ss">
            <div className="flex md:flex-col w-full md:w-fit gap-2 items-center md:justify-center">
                <IconCamera className="size-16 flex-shrink-0"/>
                <div className="flex flex-col text-sm md:mt-8 md:mb-12">
                    <span className="md:font-black font-medium md:text-3xl">{t('nopost')}</span>
                    <span className="text-gray text-sm md:hidden block">{t('when')} {userInfo.username} {t('noposttext')}</span>
                </div>
            </div>
        </div>
    )
}