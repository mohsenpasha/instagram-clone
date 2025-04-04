'use client'

import PostList from "@/components/PostList"
import SinglePost, { UnfollowPopup, UserList } from "@/components/SinglePost"
import { useEffect, useRef, useState } from "react"
import { useParams } from 'next/navigation'
import { PostPopupSlider } from "@/components/PostPopupSlider"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { disableScroll, enableScroll } from "@/utils/scroll"
import { IconCamera, IconPrivatePage } from "@/components/Icons"
import { FollowBtn } from "@/components/FollowBtn"
import { fetchGetUserInfo } from "@/api/userInfo"
import { useClickOutside } from "@/hooks/useClickOutside"
import { addPostDetail, addPostList, changeListTitle, changeListUrl, changePostListUrl, clearCommentList, clearUserList } from "@/store/slices/postSlice"
import { changeUnfollow } from "@/store/slices/userSlice"

export default function Profile(){
    const router = useRouter();
    const popupPost = useSelector((state: RootState) => state.popupPost.postDetail);
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const postList = useSelector((state: RootState) => state.popupPost.postList);
    const postListUrl = useSelector((state: RootState) => state.popupPost.postListUrl);
    const hasFetchedPostFirstTime = useRef(false);
    const userListRef = useRef(null)
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    useClickOutside(userListRef, () => !unfollowDetail ? dispatch(changeListTitle(null)) : {});
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    const [userListToggle,setUserListToggle] = useState(false)
    const dispatch = useDispatch();
    const params = useParams()
    const postRef = useRef(`http://localhost:8000/${params.id}/posts`)
    const [isLoading, setIsLoading] = useState(false);
    const [isUnfollowInList,setIsUnfollowInList] = useState(false)
    useEffect(()=>{
        if(listTitle){
            setUserListToggle(true)
            setIsUnfollowInList(true)
        }
        else{
            setIsUnfollowInList(false)
            dispatch(clearUserList())
            dispatch(changeListUrl(null))
            setUserListToggle(false)
        }
    },[listTitle])
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
        dispatch(changePostListUrl(`http://localhost:8000/${params.id}/posts`))
        if(!userInfo.is_private && !hasFetchedPostFirstTime.current){
            fetchPosts()
            hasFetchedPostFirstTime.current = true
            window.addEventListener("scroll", handleScroll);
            // return () => window.removeEventListener("scroll", handleScroll);
        }
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
                {postUrl && 
                    <PostPopupSlider/>
                }
                </>
            }
        </>
        }
        {userListToggle && 
            <UserList listType={listTitle == 'Followers' ? 'followerList' : 'followingList'} targetId={userInfo.username} ref={userListRef} closePopup={()=>dispatch(changeListTitle(null))} />
        }
        {unfollowDetail &&
            <UnfollowPopup inList={isUnfollowInList} ref={unfollowPopupRef}/>
        }
        </>
    )
}

export function PrivatePage(){
    return(
        <div className="w-full flex justify-center items-center pt-6">
            <div className="flex w-fit gap-2 items-center">
                <IconPrivatePage/>
                <div className="flex flex-col gap-[2px] text-sm">
                    <span className="font-semibold">This account is private</span>
                    <span className="text-gray">Follow to see their photos and videos.</span>
                </div>
            </div>
        </div>
    )
}

export function NoPost(){
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    return(
        <div className="w-full flex justify-center items-center md:my-14 md:p-0 p-2 border-t-[1px] border-b-[1px] border-ss">
            <div className="flex md:flex-col w-full md:w-fit gap-2 items-center md:justify-center">
                <IconCamera className="size-16 flex-shrink-0"/>
                <div className="flex flex-col text-sm md:mt-8 md:mb-12">
                    <span className="md:font-black font-medium md:text-3xl">No Posts Yet</span>
                    <span className="text-gray text-sm md:hidden block">When {userInfo.username} posts, you'll see their photos and videos here</span>
                </div>
            </div>
        </div>
    )
}