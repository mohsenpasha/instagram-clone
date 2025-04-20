'use client'
import SideBar from "@/components/SideBar";
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import i18n  from '@/../../i18n'
import { IconPosts, IconReels, IconSave, IconTagged } from "@/components/Icons";
import StoryHolder, { StoryList } from "@/components/Story";
import { changeCurrentVisitingUser, changeUnfollow } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetUserInfo } from "@/api/userInfo";
import { RootState } from "@/store/store";
import { addPostDetail, changeCommentId, changeListTitle, changeListUrl, clearCommentList, clearUserList, remove } from "@/store/slices/postSlice";
import { PostPopupSlider } from "@/components/PostPopupSlider";
import { useClickOutside } from "@/hooks/useClickOutside";
import { UnfollowPopup, UserList } from "@/components/SinglePost";
import { fetchSimpleGet } from "@/api/simpleGet";
import { changeStoriesHolder, changeUserStories } from "@/store/slices/storySlice";


export default function ProfileLayout({children} : {children : React.ReactNode}){
    const params = useParams()
    const pathname = usePathname()
    const { t } = useTranslation();
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const commentId = useSelector((state: RootState) => state.popupPost.commentId);
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const storyToggle = useSelector((state: RootState) => state.story.storyToggle);
    const dispatch = useDispatch()
    const userListRef = useRef(null)
    const userHoverPreviewRef = useRef(null)
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    const [userListType,setUserListType] = useState<'likeList' | 'followerList' | 'followingList' | 'commentlikeList' | null>(null)
    const [userListTarget,setUserListTarget] = useState<string | null>(null)
    const [isUnfollowInList,setIsUnfollowInList] = useState(false)
    const [isYourProfile,setIsYourProfile] = useState(false)
    useClickOutside([userListRef, userHoverPreviewRef], () => !unfollowDetail ? dispatch(changeListTitle(null)) : {});
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    function checkUserListTypeAndTarget(){
        if(commentId){
            setUserListType('commentlikeList')
            setUserListTarget(commentId)
        }
        else if(listTitle == 'Followers'){
            setUserListType('followerList')
            setUserListTarget(userInfo.username)
        }
        else if(listTitle == 'Following'){
            setUserListType('followingList')
            setUserListTarget(userInfo.username)
        }
        else {
            setUserListType('likeList')
            setUserListTarget(postDetail.id)
        }
    }
    async function getUserData(){
        const response = await fetchGetUserInfo(params.id)
        const jsonRes = await response.json()
        dispatch(changeCurrentVisitingUser(jsonRes))
    }
    async function getUserStories(){
        const response = await fetchSimpleGet('http://localhost:8000/stories/' + params.id)
        const jsonRes = await response.json()
        dispatch(changeUserStories(jsonRes))
    }
    async function getUserHighlight(){
        const response = await fetchSimpleGet('http://localhost:8000/highlights/' + params.id)
        const jsonRes = await response.json()
        dispatch(changeStoriesHolder(jsonRes))
    }
        useEffect(()=>{
            if(listTitle){
                setIsUnfollowInList(true)
                checkUserListTypeAndTarget()
            }
            else{
                setUserListType(null)
                setUserListTarget(null)
                setIsUnfollowInList(false)
                dispatch(clearUserList())
                dispatch(changeListUrl(null))
                dispatch(changeCommentId(null))
            }
        },[listTitle])

    useEffect(()=>{
        dispatch(remove())
        dispatch(changeCurrentVisitingUser(null))
        getUserData()
        getUserHighlight()
        getUserStories()
        if(params.id == localStorage.getItem('currentUsername')){
            setIsYourProfile(true)
        }
        else{
            setIsYourProfile(false)
        }
    },[])
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
                                        <Link className={`py-4 border-black mt-[-1px] ${pathname.endsWith(userInfo.username) ? 'border-t-[1px] text-black' : 'text-gray'} w-4/12 md:w-fit flex justify-center gap-[6px] items-center`} href={`/${params.id}/#`}>
                                            <IconPosts className="size-[12px]" />
                                            {t('post-t')}
                                        </Link>
                                        <Link className={`py-4 border-black mt-[-1px] ${pathname.endsWith('reels') ? 'border-t-[1px] text-black' : 'text-gray'} w-4/12 md:w-fit flex justify-center gap-[6px] items-center`} href={`/${params.id}/reels`}>
                                            <IconReels className="size-[12px]" />
                                            REELS
                                        </Link>
                                        {isYourProfile &&
                                            <Link className={`py-4 border-black mt-[-1px] ${pathname.endsWith('saved') ? 'border-t-[1px] text-black' : 'text-gray'} w-4/12 md:w-fit flex justify-center gap-[6px] items-center`} href={`/${params.id}/saved`}>
                                                <IconSave className="size-[12px]" />
                                                {t('saved')}
                                            </Link>
                                        }
                                        <Link className={`py-4 border-black mt-[-1px] ${pathname.endsWith('tagged') ? 'border-t-[1px] text-black' : 'text-gray'} w-4/12 md:w-fit flex justify-center gap-[6px] items-center`} href={`/${params.id}/tagged`}>
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
                    <PostPopupSlider/>
                }
                {userListType && userListTarget &&
                    <UserList listType={userListType} targetId={userListTarget} ref={userListRef} hoverPreviewRef={userHoverPreviewRef} closePopup={()=>dispatch(changeListTitle(null))} />
                }
                {unfollowDetail &&
                    <UnfollowPopup inList={isUnfollowInList} ref={unfollowPopupRef}/>
                }
                {storyToggle && 
                    <StoryList />
                }
            </div>
    )
}