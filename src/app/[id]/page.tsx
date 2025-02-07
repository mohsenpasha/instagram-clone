'use client'

import PostList from "@/components/PostList"
import SinglePost from "@/components/SinglePost"

export default function Profile(){
        return(
        <>
            <PostList isReel={false} />
            <SinglePost/>
        </>
    )
}