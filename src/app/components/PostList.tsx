'use client'
import { List } from "postcss/lib/list";
import PostPreview from "./PostPreview";
type ListType = {
    isReel: boolean
}
export default function PostList({isReel}:ListType){
    console.log(isReel)
    return(
        <div className="flex w-full mb-6 gap-[4px] flex-wrap">
            <PostPreview isReel={isReel}/> 
            <PostPreview isReel={isReel}/> 
            <PostPreview isReel={isReel}/> 
            <PostPreview isReel={isReel}/> 
            <PostPreview isReel={isReel}/> 
            <PostPreview isReel={isReel}/> 
            <PostPreview isReel={isReel}/> 
        </div>
    )
}