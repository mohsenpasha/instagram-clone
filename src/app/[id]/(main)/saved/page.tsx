'use client'
import { fetchAddSavedFolder } from "@/api/addSavedFolder"
import { fetchSimpleGet } from "@/api/simpleGet"
import { IconArrow, IconPlus, IconTick } from "@/components/Icons"
import { addPostList, clearPostList } from "@/store/slices/postSlice"
import { addSavedFolder, addSavedPosts, clearSavedFolder, clearSavedPosts } from "@/store/slices/savedSlice"
import { RootState } from "@/store/store"
import Image from "next/image"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

export default function SavedPaged(){
    const allFolder = useSelector((state: RootState)=> state.saved.folders)
    const dispatch = useDispatch()
    const [isLoading,setIsloading] = useState(false)
    const [addFolderToggle,setAddToggleFolder] = useState(false)
    const [newFolderName,setNewFolderName] = useState('')
    const [selectPostToggle,setSelectPostToggle] = useState(false)
    async function fetchSaved(){
        const response = await fetchSimpleGet('http://localhost:8000/savedposts')
        const jsonRes = await response.json()
        dispatch(addSavedPosts(jsonRes.posts))
        dispatch(addSavedFolder(jsonRes.folders))
    }
    useEffect(()=>{
        if(!isLoading) return
        fetchSaved()
    },[isLoading])
    useEffect(()=>{
        setIsloading(true)
        dispatch(clearPostList())
        dispatch(clearSavedPosts())
        dispatch(clearSavedFolder())
    },[])
    const { t } = useTranslation()
    function nextSection(){
        setSelectPostToggle(true)
    }
    return(
        <>
            <div>
                <div className="flex w-full justify-between py-4">
                    <div className="text-gray text-sm">
                        {t('savedtext')}
                    </div>
                    <div onClick={()=>setAddToggleFolder(true)} className="text-bl hover:text-bll cursor-pointer flex font-medium items-center gap-1">
                        <IconPlus className="size-3"/>
                        <span className="text-sm">{t('newsavefolder')}</span>
                    </div>
                </div>
                <div className="flex w-full flex-wrap justify-center xl:justify-start gap-2">
                    <AllSavedPosts/>
                    {allFolder.map((item,index)=>{
                        return(
                            <SavedFolder key={index} folderName={item.name}/>
                        )
                    })}
                </div>
            </div>
            {addFolderToggle && 
            (selectPostToggle?
                <SelectPostPopup previousSection={()=>setSelectPostToggle(false)} closePopup={()=>{setSelectPostToggle(false);setAddToggleFolder(false)}} folderName={newFolderName}/>
            :
                <NewFolderPopup nextSection={nextSection} closePopup={()=>{setSelectPostToggle(false);setAddToggleFolder(false)}} newFolderName={newFolderName} setNewFolderName={setNewFolderName}/>
            )
            }
        </>
    )
}

export function AllSavedPosts(){
    const allSavedPost = useSelector((state: RootState)=> state.saved.posts)
    const dispatch = useDispatch()
    const { t } = useTranslation()
    function changePostList(){
        const filterdPosts = allSavedPost.map(item => item.post);
        dispatch(addPostList(filterdPosts))
    }
    return(
        <Link href={'saved/all-posts'} onClick={changePostList} className="relative size-[300px] cursor-pointer flex justify-between flex-wrap aspect-square">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_top,rgba(38,38,38,0.6),rgba(255,255,255,0))] hover:bg-[linear-gradient(to_top,rgba(38,38,38,.2),rgba(255,255,255,0))]">
                <span className="text-white text-xl absolute bottom-2 right-3">{t('allposts')}</span>
            </div>
            {allSavedPost.slice(0, 4).map((item,index)=>{
                const media = item.post.media[0]
                return(
                    <div key={index} className="size-[148px] aspect-square overflow-hidden">
                        <div>
                            <Image alt="" className="w-full h-full object-cover" src={media.file} width={75} height={75}></Image>
                        </div>
                    </div>
                )
            })}
        </Link>
    )
}

function SavedFolder({folderName}:{folderName:string}){
    const allSavedPost = useSelector((state: RootState)=> state.saved.posts)
    const allFolders = useSelector((state: RootState)=> state.saved.folders)
    const [currentFolder,setCurrentFolder] = useState(null)
    const [folderThumnail,setFolderThumnail] = useState(null)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(allSavedPost.length == 0, allFolders.length == 0) return
        setCurrentFolder(allFolders[allFolders.findIndex((item)=>item.name == folderName)])
    },[allSavedPost,allFolders])
    useEffect(()=>{
        if(!currentFolder) return
        const firstPostIndex = allSavedPost.findIndex((item)=> item.post.id == currentFolder.posts[0])
        setFolderThumnail(allSavedPost[firstPostIndex].post.media[0])
    },[currentFolder])
    function changePostList(){
        const filterdPosts = allSavedPost.filter((item)=> currentFolder.posts.includes(item.post.id)? true : false).map(item => item.post);
        dispatch(addPostList(filterdPosts))
    }
    if(!currentFolder) return
    return(
        <Link href={'saved/'+currentFolder.name} onClick={changePostList} className="relative size-[300px] overflow-hidden cursor-pointer flex justify-between flex-wrap aspect-square">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_top,rgba(38,38,38,0.6),rgba(255,255,255,0))] hover:bg-[linear-gradient(to_top,rgba(38,38,38,.2),rgba(255,255,255,0))]">
                <span className="text-white text-xl absolute bottom-2 right-3">{currentFolder.name}</span>
            </div>
            {folderThumnail &&
                <Image src={folderThumnail.file} width={300} height={300} alt=""></Image>
            }
        </Link>
    )
}

export function NewFolderPopup({newFolderName,setNewFolderName,closePopup,nextSection}:{newFolderName:string,setNewFolderName:Dispatch<SetStateAction<string>>,closePopup:()=>void,nextSection:()=>void}){
    const { t } = useTranslation()
    return(
        <div className="fixed top-0 left-0 w-full h-full z-50 md:flex justify-center items-center flex">
            <div onClick={closePopup} className="absolute bg-black bg-opacity-60 w-full h-full top-0 left-0">
            </div>
                <div className="relative rounded-lg w-[400px] bg-white z-40">
                    <div className="relative justify-end p-2 flex border-b-[1px] border-ss">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium">{t('newsavefolder')}</span>
                        <span className="cursor-pointer" onClick={closePopup}>
                            <IconPlus className="rotate-45 size-6"/>
                        </span>
                    </div>
                    <div className="w-10/12 border m-auto my-4 border-ss rounded-lg overflow-hidden">
                        <input value={newFolderName} onChange={(event)=>setNewFolderName(event.target.value)} className="w-full outline-none p-2 text-sm bg-[#F5F5F5]" type="text" placeholder={t('collectionname')} />
                    </div>
                    <button onClick={nextSection} disabled={newFolderName.length == 0} className="w-full border-t-[1px] border-ss flex justify-center items-center py-4 disabled:text-gray text-bl text-sm font-medium">
                        {t('next')}
                    </button>
                </div>
        </div>
    )
}

export function SelectPostPopup({closePopup,previousSection,folderName}:{closePopup:()=>void,previousSection:()=>void,folderName:string}){
    const dispatch = useDispatch()
    const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);
    const handleCheckboxChange = (postId: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedPostIds((prev) => [...prev, postId]);
        } else {
            setSelectedPostIds((prev) => prev.filter((id) => id !== postId));
        }
    };
    async function fetchNewFolder(){
        const response = await fetchAddSavedFolder({folder_name:folderName,post_list:selectedPostIds})
        const jsonRes = await response.json()
        dispatch(addSavedFolder(jsonRes))
        closePopup()
    }
    const allSavedPost = useSelector((state: RootState)=> state.saved.posts)
    const { t } = useTranslation()
    return(
        <div className="fixed top-0 left-0 w-full h-full z-50 md:flex justify-center items-center flex">
            <div onClick={closePopup} className="absolute bg-black bg-opacity-60 w-full h-full top-0 left-0">
            </div>
                <div className="relative rounded-lg w-[400px] bg-white z-40">
                    <div className="relative justify-between p-2 flex border-b-[1px] items-center border-ss w-full">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium">{t('addfromsaved')}</span>
                        <span onClick={previousSection} className="cursor-pointer">
                            <IconArrow className="rotate-90 size-5"/>
                        </span>
                        <span onClick={closePopup} className="cursor-pointer">
                            <IconPlus className="rotate-45 size-6"/>
                        </span>
                    </div>
                   <div className="h-[500px] flex flex-wrap w-full overflow-y-auto">
                        <div className="flex flex-wrap w-full h-fit">
                            {allSavedPost.map((item,index)=>{
                                const media = item.post.media[0]
                                return(
                                    <label className="relative size-[132px] overflow-hidden cursor-pointer" key={index}>
                                        <input onChange={(e) => handleCheckboxChange(item.post.id, e.target.checked)} className="peer hidden" type="checkbox" value={item.post.id} />
                                        <div className="hidden absolute z-50 w-full h-full items-center justify-center peer-checked:flex">
                                            <IconTick className="text-white"/>
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-0 transition-all hover:bg-opacity-10 peer-checked:bg-opacity-10 flex items-center justify-center"></div>
                                        <Image className="size-[133px] object-cover" src={media.file} width={134} height={134} alt=""></Image> 
                                    </label>
                                )  
                            })}
                        </div>
                   </div>
                   <div onClick={fetchNewFolder} className="w-full border-t-[1px] border-ss flex justify-center items-center py-4 text-bl text-sm font-medium cursor-pointer">
                        {t('done')}
                    </div>
                </div>
        </div>
    )
}