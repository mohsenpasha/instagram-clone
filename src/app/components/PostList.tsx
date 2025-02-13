'use client'
import { List } from "postcss/lib/list";
import PostPreview from "./PostPreview";
type ListType = {
    isReel: boolean,
    noIcon?:boolean
}
export default function PostList({isReel,noIcon}:ListType){
    console.log(isReel)
    return(
        <div className="flex w-full gap-[4px] flex-wrap">
            <PostPreview noIcon={noIcon} isReel={isReel}/> 
            <PostPreview noIcon={noIcon} isReel={isReel}/> 
            <PostPreview noIcon={noIcon} isReel={isReel}/> 
            {/* <PostPreview noIcon={noIcon} isReel={isReel}/> 
            <PostPreview noIcon={noIcon} isReel={isReel}/> 
            <PostPreview noIcon={noIcon} isReel={isReel}/> 
            <PostPreview noIcon={noIcon} isReel={isReel}/>  */}
        </div>
    )
}