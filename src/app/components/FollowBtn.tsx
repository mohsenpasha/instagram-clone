import { useEffect, useState } from "react";
import { IconFollow, IconLoading, IconLoadingButton } from "./Icons"
import { useTranslation } from "next-i18next";
import { fetchFollowUser, fetchUnfollowUser } from "@/api/followApi";
import { followUserList } from "@/store/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { changeUnfollow, toggleIsFollowing } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";

type FollowBtnType = {
    className:string,
    haveIcon?:boolean,
    bgTrasparent?:boolean,
    userData:{
        username:string,
        is_following:boolean,
        isLoading:boolean,
        profile_pic:string,
        fullSize:boolean
    },
    directUnfollow?:boolean,
    inList:boolean,
    inComment:boolean
}

export function FollowBtn({className, haveIcon,bgTrasparent=false,fullSize=false,userData,directUnfollow=false,inList=true,inComment=false}:FollowBtnType){
    const inCommentIsLoading = useSelector((state: RootState) => state.popupPost.commentHoverIsLoading);
    const dispatch = useDispatch()
    let IconAvailable = true;
    if(haveIcon == false){
        IconAvailable = haveIcon
    }
    async function followHandler(){
        const response = await fetchFollowUser(userData.username,dispatch,inList,inComment)
        if(inComment) return
        if(inList){
            dispatch(followUserList({username:userData.username,action:'follow'}))
        }
        else{
            dispatch(toggleIsFollowing(true))
        }
    }
    async function unFollowHandler(){
        const response = await fetchUnfollowUser(userData.username,dispatch,inList,inComment)
        if(inComment) return
        if(inList){
            dispatch(followUserList({username:userData.username,action:'unfollow'}))
        }
        else{
            dispatch(toggleIsFollowing(false))
        }
    }
    function openUnfollowPopup(){
        dispatch(changeUnfollow({username:userData.username,profile_pic:userData.profile_pic}))
    }
    useEffect(()=>{
        if(userData.isLoading && !directUnfollow && userData.is_following){
            unFollowHandler()
        }
    },[userData.isLoading])
    const { t } = useTranslation();
    return(
        <>
        <button disabled={(inComment && inCommentIsLoading) || userData.isLoading} onClick={()=> userData.is_following ? (directUnfollow ? unFollowHandler() : openUnfollowPopup()) : followHandler()} className={`${fullSize && 'w-full'} ${bgTrasparent ? 'bg-transparent border-[1px] border-ss border-opacity-50' : userData.is_following ? 'bg-gray hover:bg-grayer' : 'bg-bl hover:bg-bler text-white'} ${bgTrasparent ? 'px-2 py-[6px]' : 'py-[7px] px-4'} rounded-lg flex justify-center items-center gap-2 cursor-pointer font-semibold relative ${className}`}>
            {IconAvailable && !userData.is_following &&
                <IconFollow className={`${(inComment && inCommentIsLoading) || userData.isLoading ? 'opacity-0' : 'opacity-1'} size-[20px]`}/>
            }
            {((inComment && inCommentIsLoading) || userData.isLoading) &&
                <div className="absolute top-0 left-0 flex w-full h-full justify-center items-center">
                    <IconLoadingButton className={`${userData.is_following ? 'fill-[#555555]' : 'fill-[#F5F5F5]'} size-[18px]`}/>
                </div>
            }
            {
                userData.is_following ? 
                <span className={(inComment && inCommentIsLoading) || userData.isLoading ? 'opacity-0' : 'opacity-1'}>{t('following')}</span>
                :
                <span className={(inComment && inCommentIsLoading) || userData.isLoading ? 'opacity-0' : 'opacity-1'}>{t('follow')}</span>
            }
        </button>
        </>
    )
}
