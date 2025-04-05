import { useClickOutside } from "@/hooks/useClickOutside";
import { IconArrow, IconClose } from "./Icons";
import SinglePost from "./SinglePost";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPostList, change, changePostListUrl, changeUrl, remove } from '@/store/slices/postSlice'
import { RootState } from "@/store/store";

export function PostPopupSlider(){
    const { t } = useTranslation()
    const popupBoxRef = useRef(null)
    const popupArrowRef = useRef(null)
    const dispatch = useDispatch();
    const popupPost = useSelector((state: RootState)=> state.popupPost.postDetail)
    const postList = useSelector((state: RootState)=> state.popupPost.postList)
    const postUrl = useSelector((state: RootState) => state.popupPost.url);
    const postListUrl = useSelector((state: RootState) => state.popupPost.postListUrl);
    const [currentPostIndex,setCurrentPostIndex] = useState<null | number>(null)
    const [isLastPost,setIsLastPost] = useState(false)
    const [shouldFetchPosts,setShouldFetchPosts] = useState(false)
    async function fetchPosts(){
            if(!postListUrl) return
            const response = await fetch(postListUrl, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const jsonRes = await response.json()
            dispatch(addPostList(jsonRes.results))
            dispatch(changePostListUrl(jsonRes.next))
            setShouldFetchPosts(false)
        }
    useEffect(()=>{
        if(!shouldFetchPosts) return
        fetchPosts()
    },[shouldFetchPosts])
    useClickOutside([popupBoxRef,popupArrowRef], () => dispatch(remove()));
    useEffect(()=>{
        setCurrentPostIndex(postList.findIndex((item)=> item.id == postUrl.replace('/p/','')))
    },[])
    useEffect(()=>{
        if(!currentPostIndex) return
        if(!postListUrl && currentPostIndex == postList.length - 1){
            setIsLastPost(true)
        }
        else{
            setIsLastPost(false)
        }
        if((postList.length - 1 ) - currentPostIndex < 4){
            setShouldFetchPosts(true)
        }
    },[currentPostIndex])
    function changeArrow(event,dir:'next' | 'prev'){
        event.preventDefault()
        if(currentPostIndex == null) return
        let nextPostId;
        if(dir == 'next'){
            nextPostId = postList[currentPostIndex + 1].id
            setCurrentPostIndex(currentPostIndex + 1)
        }
        else{
            nextPostId = postList[currentPostIndex - 1].id
            setCurrentPostIndex(currentPostIndex - 1)
        }
        dispatch(changeUrl('/p/' + nextPostId))
    }
    return(
        <div className="fixed top-0 left-0 w-full h-full z-50 md:flex justify-center items-center bg-black bg-opacity-60">
            <span className="text-white absolute top-4 right-4 rtl:right-auto rtl:left-4">
            <IconClose/>
            </span>
            {/* <div className="flex" ref={popupBoxRef}> */}
                <div className="md:hidden h-11 z-20 flex items-center border-b-[1px] border-ss sticky top-0 bg-white">
                        <span className="px-6 cursor-pointer">
                            <IconArrow className="-rotate-90 rtl:rotate-90"/>
                        </span>
                    
                    <span className="font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{t('post')}</span>
                </div>
                <div ref={popupBoxRef} className="md:flex w-full md:w-10/12 justify-center lg:w-[900px] relative z-50">
                    {popupPost && 
                        <SinglePost isPopup={true}/>
                    }
                </div>
                <div ref={popupArrowRef} className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between z-20 px-4">
                        <span onClick={(event)=>currentPostIndex != 0 ? changeArrow(event,'prev') : {}} className={`${currentPostIndex != 0 && 'bg-white cursor-pointer'} rounded-full w-8 h-8 flex items-center justify-center -rotate-90 rtl:rotate-90`}>
                            {currentPostIndex != 0 && 
                                <IconArrow className="size-4"/>
                            }
                        </span>
                    <span onClick={(event)=> !isLastPost ? changeArrow(event,'next') : {}} className={`${!isLastPost && 'bg-white cursor-pointer'} rounded-full w-8 h-8 flex items-center justify-center rotate-90 rtl:-rotate-90`}>
                        {!isLastPost &&
                            <IconArrow className="size-4"/>
                        }
                    </span>
                </div>
            {/* </div> */}
        </div>
    )
}