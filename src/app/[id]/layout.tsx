'use client'
import SideBar from "@/components/SideBar";
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import i18n  from '@/../../i18n'
import { IconPosts, IconReels, IconTagged } from "@/components/Icons";
import StoryHolder, { StoryList } from "@/components/Story";
import { changeCurrentVisitingUser, changeUnfollow } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetUserInfo } from "@/api/userInfo";
import { RootState } from "@/store/store";
import { addPostDetail, changeListTitle, changeListUrl, clearCommentList, clearUserList } from "@/store/slices/postSlice";
import { PostPopupSlider } from "@/components/PostPopupSlider";
import { useClickOutside } from "@/hooks/useClickOutside";
import { UnfollowPopup, UserList } from "@/components/SinglePost";


export default function ProfileLayout({children} : {children : React.ReactNode}){
    const params = useParams()
    const { t } = useTranslation();
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const [userListToggle,setUserListToggle] = useState(false)
    const dispatch = useDispatch()
    const userListRef = useRef(null)
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    const popupSliderRef = useRef(null)
    useClickOutside(userListRef, () => !unfollowDetail ? dispatch(changeListTitle(null)) : {});
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    async function getUserData(){
        const response = await fetchGetUserInfo(params.id)
        const jsonRes = await response.json()
        dispatch(changeCurrentVisitingUser(jsonRes))
    }
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

    useEffect(()=>{
        getUserData()
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
    return(
            <div className={`flex justify-between`}>
                <SideBar/>
                {userInfo ? 
                    <div className="flex justify-center w-full md:w-[100vw-72px] xl:w-10/12">
                        <div className="w-full md:px-4 xl:px-0 lg:w-[930px]">
                            <ProfileHeader/>
                            {!userInfo.is_private &&
                                <div className="flex w-full justify-center">
                                    <div className="w-full md:w-6/12 justify-around flex">
                                        <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center gap-[6px] items-center" href={`/${params.id}/#`}>
                                            <IconPosts className="size-[12px]" />
                                            {t('post-t')}
                                        </Link>
                                        <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center gap-[6px] items-center" href={`/${params.id}/reels`}>
                                            <IconReels className="size-[12px]" />
                                            REELS
                                        </Link>
                                        <Link className="py-4 border-black mt-[-1px] text-gray border-t-[1px] w-4/12 md:w-fit flex justify-center gap-[6px] items-center" href={`/${params.id}/tagged`}>
                                            <IconTagged className="size-[12px]" />
                                            {t('tagged')}
                                        </Link>
                                    </div>
                                </div>
                            }
                            {children}
                        </div>
                    </div>
                    :
                    <div>loading</div>
                }
                {postUrl && 
                    <PostPopupSlider ref={popupSliderRef}/>
                }
                {unfollowDetail &&
                    <UnfollowPopup inList={isUnfollowInList} ref={unfollowPopupRef}/>
                }
                {userListToggle && 
                    <UserList listType={listTitle == 'Followers' ? 'followerList' : 'followingList'} targetId={userInfo.username} ref={userListRef} closePopup={()=>dispatch(changeListTitle(null))} />
                }
                {/* <StoryList /> */}
            </div>
    )
}