import { useEffect, useState } from "react";
import { IconFollow } from "./Icons"
import { useTranslation } from "next-i18next";
import { fetchFollowUser, fetchUnfollowUser } from "@/api/followApi";
import { followUserList } from "@/store/slices/postSlice";
import { useDispatch } from "react-redux";
import { changeUnfollow } from "@/store/slices/userSlice";

type FollowBtnType = {
    haveIcon?:boolean,
    bgTrasparent?:boolean,
    userData:{
        username:string,
        is_following:boolean,
        isLoading:boolean,
        profile_pic:string
    },
    directUnfollow?:boolean
}

export function FollowBtn({haveIcon,bgTrasparent=false,userData,directUnfollow=false}:FollowBtnType){
    const dispatch = useDispatch()
    let IconAvailable = true;
    if(haveIcon == false){
        IconAvailable = haveIcon
    }
    followUserList
    async function followHandler(){
        const response = await fetchFollowUser(userData.username,dispatch)
        const jsonRes = await response.json()
        dispatch(followUserList({username:userData.username,action:'follow'}))
    }
    async function unFollowHandler(){
        const response = await fetchUnfollowUser(userData.username,dispatch)
        const jsonRes = await response.json()
        dispatch(followUserList({username:userData.username,action:'unfollow'}))
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
        <button disabled={userData.isLoading} onClick={()=> userData.is_following ? (directUnfollow ? unFollowHandler() : openUnfollowPopup()) : followHandler()} className={`${bgTrasparent ? 'bg-transparent border-[1px] border-ss border-opacity-50' : userData.is_following ? 'bg-gray hover:bg-grayer' : 'bg-bl hover:bg-bler text-white'} ${bgTrasparent ? 'px-2 py-[6px]' : 'py-[7px] px-4'} rounded-lg flex justify-center items-center gap-2 cursor-pointer font-semibold relative`}>
            {IconAvailable && !userData.is_following &&
                <IconFollow className="size-[20px]"/>
            }
            {userData.isLoading &&
                <div className={`absolute left-1/2 top-1/2 w-5 h-5 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin`}></div>
            }
            {
                userData.is_following ? 
                <span className={userData.isLoading ? 'opacity-0' : 'opacity-1'}>{t('following')}</span>
                :
                <span className={userData.isLoading ? 'opacity-0' : 'opacity-1'}>{t('follow')}</span>
            }
        </button>
        </>
    )
}

