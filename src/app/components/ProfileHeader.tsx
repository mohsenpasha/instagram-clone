'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslation } from "next-i18next";
import HighLight from '@/components/HighLight';

export default function ProfileHeader(){
    const { t } = useTranslation();
    const params = useParams()
    return(
        <div className='p-0 lg:p-[24px]'>
            <div className='flex px-4 md:px-0 pt-10 gap-4'>
                <div className="w-fit md:w-4/12 items-center flex justify-center">
                    <div className='rounded-full overflow-hidden size-[77px] md:size-[150px]'>
                        <Image src='/images/profile-img.jpeg' width={150} height={150} alt='' />
                    </div>
                </div>
                <div className='w-8/12 grid'>
                    <div className="flex items-center gap-2">
                        <div className='text-xl'>{params.id}</div>
                        <div>{t('follow')}</div>
                        <div>{t('message')}</div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 my-4">
                        <div className='gap-1 flex'>
                            <span className='font-bold'>100</span>
                            {t('posts')}
                        </div>
                        <div className='gap-1 flex'>
                            <span className='font-bold'>245</span>
                            {t('followers')}
                        </div>
                        <div className='gap-1 flex'>
                            <span className='font-bold'>124</span>
                            {t('following')}
                        </div>
                    </div>
                    <div className="">𝐑𝐚𝐩𝐟𝐚 𝐞𝐝𝐢𝐭𝐨𝐫</div>
                </div>

            </div>
            <div className='p-4 flex my-4 w-full'>
                <HighLight/>
                <HighLight/>
                <HighLight/>
                <HighLight/>
            </div>
            <div className="flex md:hidden items-center py-3 justify-around border-t-[1px] border-s gap-4 mt-4 w-full">
                <div className='flex flex-col items-center w-4/12 justify-center'>
                    <span className='font-bold'>100</span>
                    {t('posts')}
                </div>
                <div className='flex flex-col items-center w-4/12 justify-center'>
                    <span className='font-bold'>245</span>
                    {t('followers')}
                </div>
                <div className='flex flex-col items-center w-4/12 justify-center'>
                    <span className='font-bold'>124</span>
                    {t('following')}
                </div>
            </div>
        </div>
    )
}