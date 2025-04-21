'use client'
import SideBar from "@/components/SideBar";
import { appWithTranslation, useTranslation } from "next-i18next";
import '../../i18n';
import StorySlider from "./components/StorySlider";
import { useEffect, useRef, useState } from "react";
import { fetchSimpleGet } from "./api/simpleGet";
import { useDispatch, useSelector } from "react-redux";
import { changeStoriesHolder } from "./store/slices/storySlice";
import { RootState } from "./store/store";
import { StoryList } from "./components/Story";
import HomePosts from "./components/HomePosts";
import { addPostList, changeCommentId, changeListTitle, changeListUrl, clearUserList } from "./store/slices/postSlice";
import { UserList } from "./components/SinglePost";
import { useClickOutside } from "./hooks/useClickOutside";
import { changeUnfollow } from "./store/slices/userSlice";
import Link from "next/link";
import Image from "next/image";

function Home() {
  const storyToggle = useSelector((state: RootState)=> state.story.storyToggle)
  const postList = useSelector((state: RootState)=> state.popupPost.postList)
  const [isLoading,setIsloading] = useState(false)
  const listTitle = useSelector((state: RootState)=> state.popupPost.listTitle)
  const commentId = useSelector((state: RootState) => state.popupPost.commentId);
  const unfollowDetail = useSelector((state: RootState) => state.currentUser.unfollowDetail);
  const userListRef = useRef(null)
  const unfollowPopupRef = useRef(null)
  const userHoverPreviewRef = useRef(null)
  // useClickOutside([userListRef, userHoverPreviewRef], () => console.log('cliecked outside'));
  useClickOutside([userListRef, userHoverPreviewRef], () => !unfollowDetail ? dispatch(changeListTitle(null)) : {});
  useClickOutside(unfollowPopupRef, () => dispatch(changeUnfollow(null)));
  const [userListType,setUserListType] = useState<'likeList' | 'followerList' | 'followingList' | 'commentlikeList' | null>(null)
  const [userListTarget,setUserListTarget] = useState(null)
  const [suggestedUsers,SetSuggestedUsers] = useState([])
  function checkUserListTypeAndTarget(){
    dispatch(clearUserList())
    console.log(commentId)
      if(commentId){
          setUserListType('commentlikeList')
          setUserListTarget(commentId)
      }
      else {
          setUserListType('likeList')
          setUserListTarget(postList.filter((item)=> item.activeStatus == true)[0].id)
      }
  }
  useEffect(()=>{
    if(!listTitle){
      dispatch(clearUserList())
      dispatch(changeListUrl(null))
      dispatch(changeCommentId(null))
      setUserListType(null)
      setUserListTarget(null)
      return
    }
      checkUserListTypeAndTarget()
  },[listTitle])
  useEffect(()=>{
      if(!postList) return
  },[postList])
  const dispatch = useDispatch()
  async function fetchSuggested(){
    console.log('fetching story')
    setIsloading(true)
    const response = await fetchSimpleGet('http://localhost:8000/suggestedusers')
    const jsonRes = await response.json()
    SetSuggestedUsers(jsonRes)
    setIsloading(false)
  }
  async function fetchStories(){
    console.log('fetching story')
    setIsloading(true)
    const response = await fetchSimpleGet('http://localhost:8000/homestories')
    const jsonRes = await response.json()
    dispatch(changeStoriesHolder(jsonRes))
    setIsloading(false)
  }
  async function fetchFeedPosts(){
    console.log('fetching story')
    setIsloading(true)
    const response = await fetchSimpleGet('http://localhost:8000/feedposts')
    const jsonRes = await response.json()
    console.log(jsonRes)
    dispatch(addPostList(jsonRes))
    setIsloading(false)
  }
  useEffect(()=>{
    fetchStories()
    fetchFeedPosts()
    fetchSuggested()
  },[])
  const { t } = useTranslation();
  return (
    <>
      <div className="flex justify-between">
        <SideBar/>
        <div className="flex justify-center gap-4 w-full md:w-[100vw-72px] xl:w-10/12">
          <div className="w-full md:ml-6 md:px-4 xl:px-0 lg:w-8/12 xl:w-[740px] flex flex-col justify-center items-center">
            <StorySlider/>
            <div className="flex w-full md:w-8/12">
              <HomePosts/>
            </div>
          </div>
          <div className="mt-6 hidden w-[260px] xl:block">
            <div className="text-gray text-sm font-medium my-4">{t('suggested')}</div>
            {suggestedUsers.map((item,index)=>{
             return(
               <div key={index} className="py-2">
                <div className={`flex gap-2 items-center justify-between`}>
                  <div className="flex gap-2 items-center">
                    <Link href={item.username} className={`size-11 rounded-full overflow-hidden flex-shrink-0 relative`}>
                        <Image className="rounded-full" src={item.profile_pic || '/images/profile-img.jpeg'} alt="" width={44} height={44}></Image>
                    </Link>
                    <div className={`flex flex-col text-sm leading-[18px] relative`}>
                        <Link className="font-semibold truncate inline-block w-fit" href={item.username}>
                            {item.username}
                        </Link>
                        <span className="text-xs text-gray">{item.name}</span>
                    </div>
                  </div>
                  <div className="cursor-pointer flex-shrink-0 text-bl font-medium text-xs over">
                    {t('follow')}
                  </div>
                </div>
            </div>
            ) 
           })}
          </div>
        </div>
      </div>
      {storyToggle && 
        <StoryList />
      }
      {userListType && userListTarget &&
        <UserList listType={userListType} targetId={userListTarget} ref={userListRef} hoverPreviewRef={userHoverPreviewRef} closePopup={()=>dispatch(changeListTitle(null))} />
      }
    </>
  );
}
export default appWithTranslation(Home)