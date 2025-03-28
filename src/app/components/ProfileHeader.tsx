'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslation } from "next-i18next";
import HighLight from '@/components/HighLight';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FollowBtn } from './FollowBtn';
import { changeListTitle } from '@/store/slices/postSlice';

export default function ProfileHeader(){
    const userInfo = useSelector((state: RootState) => state.currentUser.currentVisitingUser);
    const { t } = useTranslation();
    const params = useParams()
    const dispatch = useDispatch()
    function toggleFollowerList(){
        if((userInfo.is_private && !userInfo.is_following) || userInfo.follower_count == 0) return
        dispatch((changeListTitle('Followers')))
    }
    function toggleFollowingList(){
        if((userInfo.is_private && !userInfo.is_following) || userInfo.following_count == 0) return
        dispatch((changeListTitle('Following')))
    }
    if(!userInfo) return
    return(
        <div className='md:py-6 border-b-[1px] border-d'>
            <div className='flex px-4 md:px-0 pt-10 gap-4'>
                <div className="w-fit md:w-4/12 items-center flex justify-center">
                    <div className='rounded-full overflow-hidden size-[77px] md:size-[150px]'>
                        <Image src={userInfo.profile_pic || '/images/profile-img.jpeg'} width={150} height={150} alt='' />
                    </div>
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
                    <HighLight/>
                    <HighLight/>
                    <HighLight/>
                    <HighLight/>
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