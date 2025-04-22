'use client'

import SideBar from "@/components/SideBar"
import { UnfollowPopup, UserList } from "@/components/SinglePost"
import { useClickOutside } from "@/hooks/useClickOutside"
import { changeCommentId, changeListTitle, changeListUrl, clearUserList, remove } from "@/store/slices/postSlice"
import { clearSavedPosts } from "@/store/slices/savedSlice"
import { changeUnfollow } from "@/store/slices/userSlice"
import { RootState } from "@/store/store"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function PostLayout({children}:{children:React.ReactNode}){
    const dispatch = useDispatch()
    const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
    const commentId = useSelector((state: RootState) => state.popupPost.commentId);
    const listTitle = useSelector((state: RootState) => state.popupPost.listTitle);
    const postDetail = useSelector((state: RootState) => state.popupPost.postDetail);
    const userListRef = useRef(null)
    const userHoverPreviewRef = useRef(null)
    const unfollowPopupRef = useRef<HTMLElement | null>(null)
    const [userListType,setUserListType] = useState<'likeList' | 'followerList' | 'followingList' | 'commentlikeList' | null>(null)
    const [userListTarget,setUserListTarget] = useState<string | null>(null)
    const [isUnfollowInList,setIsUnfollowInList] = useState(false)
    useClickOutside([userListRef, userHoverPreviewRef], () => !unfollowDetail ? dispatch(changeListTitle(null)) : {});
    useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
    function checkUserListTypeAndTarget(){
        if(commentId){
            setUserListType('commentlikeList')
            setUserListTarget(commentId)
        }
        else if(listTitle == 'Likes'){
            setUserListType('likeList')
            setUserListTarget(postDetail.id)
        }
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
        dispatch(clearSavedPosts())
    },[])
    return(
        <>
            <div className="flex">
                <SideBar/>
                <div className="flex justify-center w-full md:w-[100vw-72px] xl:w-10/12">
                    <div className="w-full md:px-4 xl:px-0 lg:w-[930px]">
                        {children}
                    </div>
                </div>
            </div>
            {userListType && userListTarget &&
                <UserList listType={userListType} targetId={userListTarget} ref={userListRef} hoverPreviewRef={userHoverPreviewRef} closePopup={()=>dispatch(changeListTitle(null))} />
            }
            {unfollowDetail &&
                <UnfollowPopup inList={isUnfollowInList} ref={unfollowPopupRef}/>
            }
        </>
    )
}