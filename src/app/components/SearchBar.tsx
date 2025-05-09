import { Dispatch, MouseEvent, RefObject, SetStateAction, useEffect, useState } from "react";
import { IconClose, IconLoadingButton, IconSearch } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import { addSingleSearch, emptySearchHistory, getSearchHistory, removeSingleSearch } from "@/utils/search";
import { fetchSearchUserAndTag } from "@/api/searchApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addSearchHistory, changeSearchChange, changeSearchType, clearSearchHistory, removeSearchHistoryItem, toggleSearch, toggleSearchLoading } from "@/store/slices/searchSlice";
import { useTranslation } from "react-i18next";

export default function SearchBar({closeAnimationStat,ref}:{closeAnimationStat:boolean,ref?:RefObject<HTMLElement | null>}){
    const searchChange = useSelector((state: RootState) => state.searchInfo.searchChangeList)
    const searchType = useSelector((state: RootState) => state.searchInfo.searchType)
    const isSearchLoading = useSelector((state: RootState) => state.searchInfo.isSearchLoading)
    const dispatch = useDispatch()
    useEffect(()=>{
        const localSearchHistory = localStorage.getItem("searchHistory")
        if(!localSearchHistory) return
        JSON.parse(localSearchHistory).map((item)=>{
            dispatch(addSearchHistory({type:item.type,id:item.id,subtitle:item.subtitle,profile_pic:item.profile_pic}))
        })
    },[])
    const { t } = useTranslation();
    return(
        <div ref={ref} className={`absolute flex flex-col h-[100vh] top-0 ltr:left-[74px] rtl:right-[74px] bg-white rounded-2xl rounded-l-none rounded-bl-none w-96 z-50 py-2 ltr:shadow-[4px_0px_8px_rgba(0,0,0,.1)] rtl:shadow-[-4px_0px_8px_rgba(0,0,0,.1)] ${closeAnimationStat ? 'animate-maxWClose' : 'animate-maxW'}`}>
            <div className="border-b-[1px] border-ss">
                <div className="p-3 pb-9 pl-6 text-2xl font-semibold">
                    {t('search')}
                </div>
                <SearchInput />
            </div>
            {(searchChange && searchType && !isSearchLoading) ?
                searchChange.length == 0 ?
                    <div className="flex flex-1 items-center justify-center text-gray text-sm font-medium">
                        {t('noresultfound')}
                    </div>
                :
                    searchChange.map((item,index)=>{
                        return <SingleSearchResult key={index} id={searchType == 'tag' ? item.tag : item.username} profilePic={searchType == 'tag' ? null : item.profile_pic} subtitle={searchType == 'tag' ? item.post_count : item.name} type={searchType}/>
                    })
            :
            isSearchLoading ?
                <SearchLoading/>
                :
                <RecentSearch/>
            }
        </div>
    ) 
}

export function SearchInput(){
    const [searchValue,setSearchValue] = useState('')
    const searchType = useSelector((state: RootState) => state.searchInfo.searchType)
    const isSearchLoading = useSelector((state: RootState) => state.searchInfo.isSearchLoading)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(!searchValue) return
        if(searchValue[0] == '#'){
            dispatch(changeSearchType('tag'))
        }
        else{
            dispatch(changeSearchType('user'))
        }
        fetchSearch()
    },[searchValue])
    async function fetchSearch(){
        if(!searchType) return
        dispatch(toggleSearchLoading(true))
        const response = await fetchSearchUserAndTag(searchType,searchValue.replace('@','').replace('#',''))
        const jsonRes = await response.json()
        if(response.status == 200){
            dispatch(changeSearchChange(jsonRes))
        }
        dispatch(toggleSearchLoading(false))
    }
    function clearSearchInput(){
        dispatch(changeSearchChange(null))
        dispatch(changeSearchType(null))
        setSearchValue('')
    }
    const { t } = useTranslation();
    return(
        <div className="flex bg-gray rounded-lg justify-between items-center text-gray px-4 py-2 mx-4 mb-5 flex-row-reverse relative">
            <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} className="peer bg-transparent outline-none border-none w-full placeholder:text-gray font-thin placeholder:font-thin" type="text" placeholder={t('search')} />
            <IconSearch className="peer-focus:hidden flex-shrink-0 size-4 ltr:mr-2 rtl:ml-2"/>
            <span onClick={()=>!isSearchLoading ? clearSearchInput() : {}} className={`opacity-0 peer peer-focus:opacity-100 flex absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 rounded-full ${!isSearchLoading && 'bg-zinc-300'} size-4 justify-center items-center cursor-pointer`}>
                {isSearchLoading ?
                    <IconLoadingButton className="size-4 fill-[#555555]"/>
                    :
                    <IconClose className="size-2 text-white"/>
                }
            </span>
        </div>
    )
}
export function RecentSearch(){
    const searchHistory = useSelector((state: RootState)=> state.searchInfo.searchHistory)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(!searchHistory){
            emptySearchHistory()
        }
    },[])
    function handleClearSearchHistory(){
        emptySearchHistory()
        setTimeout(() => {
            dispatch(clearSearchHistory())
        }, 10);
    }
    const { t } = useTranslation();
     return(

        <div className="flex flex-col flex-1 overflow-y-auto py-3">
            <div className="font-medium flex w-full justify-between py-3 px-6">
                <span>{t('recent')}</span>
                {searchHistory.length != 0 &&
                    <span onClick={handleClearSearchHistory} className="text-bl hover:text-bll cursor-pointer text-sm">
                        {t('clearall')}
                    </span>
                }
            </div>
            {searchHistory.length == 0 ? 
                <div className="flex flex-1 items-center justify-center text-gray text-sm font-medium">
                    {t('norecentsearch')}
                </div>
            :
                <div>
                    {searchHistory.map((item,index)=>{
                        return <SingleSearchResult key={index} type={item.type} id={item.id} profilePic={item.profile_pic} localHistory={true} subtitle={item.subtitle}/>
                    })}
                </div>
            }
        </div>
     )
}

export function SingleSearchResult({type,id,subtitle,profilePic,localHistory,isAddTag=false}:{type:'user' | 'tag',id:string,subtitle:string | number,profilePic?:string,localHistory?:boolean,isAddTag?:boolean}){
    const dispatch = useDispatch()
    function handleSearchClick(e: React.MouseEvent) {
        if(isAddTag){
            e.preventDefault()
            return
        }
        if ((e.target as HTMLElement).closest('.prevent-link')) return;
        console.log('test')
        dispatch(toggleSearch(true))
        dispatch(changeSearchChange(null))
        dispatch(changeSearchType(null))
        addSingleSearch(type,id,subtitle,profilePic)
        dispatch(addSearchHistory({type:type,id:id,subtitle:subtitle,profile_pic:profilePic}))
    }
    function removeSearchItem(e: React.MouseEvent){
        e.preventDefault();
        setTimeout(() => {
            dispatch(removeSearchHistoryItem({type:type,id:id}))
          }, 10);
        removeSingleSearch(type,id)
    }
    const { t } = useTranslation();
    return(
        <Link onClick={handleSearchClick} href={type == 'tag' ? `/tags/${id}` : `/${id}`} className="py-2 px-6 flex gap-3 items-center cursor-pointer bg-white hover:bg-gray">
            {type == 'tag' ?
                <div className="rounded-full flex-shrink-0 relative size-11 border-[1px] border-ss items-center justify-center flex text-2xl">
                    #
                </div>
            :
                <div className="rounded-full flex-shrink-0 relative size-11 overflow-hidden animate-Skeleton">
                    <Image className="rounded-full" src={profilePic || '/images/profile-img.jpeg'} alt="" width={44} height={44}></Image>
                </div>
            }
            <div className="flex flex-1 flex-col text-sm leading-[18px] relative">
                <span className="font-semibold truncate inline-block w-fit" >
                    {type == 'tag' && '#'}{id}
                </span>
                {type == 'tag' ? 
                    localHistory ?
                        <span className="text-gray truncate">{subtitle} {t('posts')}</span>
                        :
                        (
                            subtitle < 100 ?
                            <span className="text-gray truncate">{t('ft100')}</span>
                            :
                            <span className="text-gray truncate">{subtitle}</span>
                        )
                    :
                    <span className="text-gray truncate">{subtitle}</span>
                }
            </div>
            {localHistory && 
                <div onClick={(e)=>{removeSearchItem(e)}} className="cursor-pointer flex-shrink-0 over text-sm prevent-link">
                    <IconClose className="size-4 text-gray"/>
                </div>
            }
        </Link>
    )
}

export function SearchLoading(){
    return(
        <>
        {[...Array(10)].map((_,index)=>{
            return(
                <div key={index} className="py-2 px-6 flex gap-3 items-center bg-white">
                    <div className="rounded-full flex-shrink-0 relative size-11 items-center justify-center flex text-2xl animate-Skeleton"></div>
                    <div className="flex flex-1 flex-col text-sm leading-[18px] relative gap-2">
                        <span className="h-3 rounded-md w-10/12 animate-Skeleton"></span>
                        <span className="h-3 rounded-md w-8/12 animate-Skeleton"></span>
                    </div>
                </div>
            )
            })
            }
        </>
    )
}