'use client'
import PostList from "@/components/PostList";
import SinglePost, { UserList } from "@/components/SinglePost";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { changeUrl, remove, addPostDetail} from '@/store/slices/postSlice'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function PostPage(){
    const params = useParams()
    const [singlePostDetail,setSinglePostDetail] = useState(null)
    const [likeListToggle,setLikeListToggle] = useState(false)
    const dispatch = useDispatch();
    useEffect(()=>{
        fetchPost()
    },[])
    
    const { t } = useTranslation();
    async function fetchPost(){
        const response = await fetch(`http://localhost:8000/getpost/${params.id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const jsonRes = await response.json()
        dispatch(addPostDetail(jsonRes))

        setSinglePostDetail(jsonRes)
    }
    

    return(
        <div className={`flex flex-wrap xl:w-10/12 justify-center [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300`}>
            <div className="flex w-full md:w-11/12 lg:10/12 justify-center my-8">
                <div className="w-full md:px-4 xl:px-0 lg:w-10/12 xl:w-8/12">
                    {singlePostDetail && 
                        <SinglePost singlePostDetail={singlePostDetail}/>
                    }
                </div>
            </div>
            <div className="flex justify-center w-full md:w-11/12 lg:10/12">
                <div className="w-full md:px-4 xl:px-0 lg:w-11/12 xl:w-9/12 md:border-t-[1px] pt-4 border-ss mb-[50px]">
                    <div className="py-4">
                        <span className="text-gray">{t('morepf')}</span>
                        <Link className="mx-1 hover:text-zinc-400" href='afshin_bizar'>afshin_bizar</Link>
                    </div>
                    <PostList isReel={false}/>
                </div>
            </div>
        </div>
    )
}