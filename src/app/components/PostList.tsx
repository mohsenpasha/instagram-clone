'use client'
import { List } from "postcss/lib/list";
import PostPreview from "./PostPreview";
import { PostPopupSlider } from "./PostPopupSlider";
import { useRef } from "react";
type ListType = {
    isReel: boolean,
    noIcon?:boolean,
    postList:[]
}
export default function PostList({isReel,noIcon,postList}:ListType){
    return(
        <div className="flex pb-12 md:pb-0 w-full gap-[4px] flex-wrap">
            {postList?.map((item,index)=>{
                return <PostPreview key={index} postDetail={item} noIcon={noIcon} isReel={isReel}/>
            })}
        </div>
    )
}