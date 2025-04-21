'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslation } from "next-i18next";
import HighLight from '@/components/HighLight';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FollowBtn } from './FollowBtn';
import { changeListTitle } from '@/store/slices/postSlice';
import { changeStoryToggle, changeStoryType } from '@/store/slices/storySlice';

export default function ProfileHeader(){
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const highlights = useSelector((state: RootState) => state.story.storiesHolder);
    const userStories = useSelector((state: RootState) => state.story.userStories);
    function toggleStories(){
        dispatch(changeStoryToggle(true))
        dispatch(changeStoryType('userStory'))
    }
    const { t } = useTranslation();
    const params = useParams()
    const dispatch = useDispatch()
    function toggleFollowerList(){
        if(!userInfo) return
        if((userInfo.is_private && !userInfo.is_following) || userInfo.follower_count == 0) return
        dispatch((changeListTitle('Followers')))
    }
    function toggleFollowingList(){
        if(!userInfo) return
        if((userInfo.is_private && !userInfo.is_following) || userInfo.following_count == 0) return
        dispatch((changeListTitle('Following')))
    }
    if(!userInfo) return
    return(
        <div className='md:py-6 border-b-[1px] border-d'>
            <div className='flex px-4 md:px-0 pt-10 gap-4'>
                <div className="w-fit md:w-4/12 items-center flex justify-center">
                    {userStories && userStories.length != 0 ?
                        <div onClick={()=>toggleStories()} className='rounded-full size-[86px] md:size-[162px] p-[2px] [background:conic-gradient(from_180deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)] flex items-center justify-center cursor-pointer'>
                            <div className='size-[80px] md:size-[156px] rounded-full flex items-center justify-center bg-white'>
                                <Image className='size-[77px] md:size-[150px] rounded-full border-[1px] border-ss' src={userInfo.profile_pic || '/images/profile-img.jpeg'} width={150} height={150} alt='' />
                            </div>
                        </div>
                    :
                    <div className='size-[77px] md:size-[150px] rounded-full flex items-center justify-center'>
                        <Image className='size-[77px] md:size-[150px] rounded-full border-[1px] border-ss' src={userInfo.profile_pic || '/images/profile-img.jpeg'} width={150} height={150} alt='' />
                    </div>
                    }
                </div>
                <div className='w-8/12 grid'>
                    <div className="flex items-center gap-2">
                        <div className='text-xl'>{params.id}</div>
                        <FollowBtn inList={false} userData={userInfo}/>
                        <div>{t('message')}</div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 my-4">
                        <div className='gap-1 flex'>
                            <span className='font-bold'>{userInfo.post_count}</span>
                            {t('posts')}
                        </div>
                        <div onClick={toggleFollowerList} className='gap-1 flex cursor-pointer hover:opacity-60'>
                            <span className='font-bold'>{userInfo.follower_count}</span>
                            {t('followers')}
                        </div>
                        <div onClick={toggleFollowingList} className='gap-1 flex cursor-pointer hover:opacity-60'>
                            <span className='font-bold'>{userInfo.following_count}</span>
                            {t('following')}
                        </div>
                    </div>
                    <div className="">{userInfo.name}</div>
                </div>

            </div>
            {!userInfo.is_private &&
                <div className='p-4 flex my-4 w-full'>
                    {highlights?.map((item,index)=>{
                        return (
                        <HighLight name={item.name} thumbnail={item.thumbnail} currentIndex={index} key={index}/>
                    )
                    })}
                </div>
            }
            <div className="flex md:hidden items-center py-3 justify-around border-t-[1px] border-ss gap-4 mt-4 w-full">
                <div className='flex flex-col items-center w-4/12 justify-center'>
                    <span className='font-bold'>{userInfo.post_count}</span>
                    {t('posts')}
                </div>
                <div onClick={toggleFollowerList} className='flex flex-col items-center w-4/12 justify-center cursor-pointer hover:opacity-40'>
                    <span className='font-bold'>{userInfo.follower_count}</span>
                    {t('followers')}
                </div>
                <div onClick={toggleFollowingList} className='flex flex-col items-center w-4/12 justify-center cursor-pointer hover:opacity-40'>
                    <span className='font-bold'>{userInfo.following_count}</span>
                    {t('following')}
                </div>
            </div>
        </div>
    )
}