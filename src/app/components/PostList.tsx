'use client'
import { List } from "postcss/lib/list";
import PostPreview from "./PostPreview";
import { PostPopupSlider } from "./PostPopupSlider";
import { useRef } from "react";
type ListType = {
    isReel: boolean,
    noIcon?:boolean,
    postList:[],
    isHoverPreview?:boolean,
    popupOpen?:boolean
}
export default function PostList({isReel,noIcon,postList,isHoverPreview=false,popupOpen=true}:ListType){
    return(
        <div className="flex pb-12 md:pb-0 w-full gap-[4px] flex-wrap">
            {postList?.map((item,index)=>{
                return <PostPreview popupOpen={popupOpen} key={index} postDetail={item} noIcon={noIcon} isReel={isReel} isHoverPreview={isHoverPreview}/>
            })}
        </div>
    )
}