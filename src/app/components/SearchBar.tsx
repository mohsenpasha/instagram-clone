import { Dispatch, MouseEvent, RefObject, SetStateAction, useState } from "react";
import { IconClose, IconSearch } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import { addSingleSearch, emptySearchHistory, getSearchHistory, removeSingleSearch } from "@/utils/search";

export default function SearchBar({closeAnimationStat,ref}:{closeAnimationStat:boolean,ref?:RefObject<HTMLElement | null>}){
    
    const [searchValue,setSearchValue] = useState('')
    return(
        <div ref={ref} className={`absolute flex flex-col h-[100vh] top-0 left-[74px] bg-white rounded-2xl rounded-l-none rounded-bl-none w-96 z-50 py-2 shadow-[4px_0px_8px_rgba(0,0,0,.1)] ${closeAnimationStat ? 'animate-maxWClose' : 'animate-maxW'}`}>
            <div className="border-b-[1px] border-ss">
                <div className="p-3 pb-9 pl-6 text-2xl font-semibold">
                    Search
                </div>
                <SearchInput searchValue={searchValue} setSearchValue={setSearchValue}/>
            </div>
            {/* <div className=""> */}
                <RecentSearch/>
            {/* </div> */}
        </div>
    ) 
}

export function SearchInput({searchValue,setSearchValue}:{searchValue:string,setSearchValue:Dispatch<SetStateAction<string>>}){ 
    return(
        <div className="flex bg-gray rounded-lg justify-between items-center text-gray px-4 py-2 mx-4 mb-5 flex-row-reverse relative">
            <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} className="peer bg-transparent outline-none border-none w-full placeholder:text-gray font-thin placeholder:font-thin" type="text" placeholder="Search" />
            <IconSearch className="peer-focus:hidden flex-shrink-0 size-4 mr-2"/>
            <span onClick={()=>setSearchValue('')} className="opacity-0 peer-focus:opacity-100 flex absolute top-1/2 -translate-y-1/2 right-4 rounded-full bg-zinc-300 size-4 justify-center items-center cursor-pointer">
                <IconClose className="size-2 text-white"/>
            </span>
        </div>
    )
}
export function RecentSearch(){
    const searchHistory = getSearchHistory()
     return(

        <div className="flex flex-col flex-1 overflow-y-auto py-3">
            <div className="font-medium flex w-full justify-between py-3 px-6">
                <span>Recent</span>
                {searchHistory.length != 0 &&
                    <span onClick={emptySearchHistory} className="text-bl hover:text-bll cursor-pointer text-sm">
                        Clear all
                    </span>
                }
            </div>
            {searchHistory.length == 0 ? 
                <div className="flex flex-1 items-center justify-center text-gray text-sm font-medium">
                    No recent searches.
                </div>
            :
                <div>
                    {searchHistory.map((item,index)=>{
                        return <SingleSearchResult key={index} type={item.type} id={item.id} subtitle={item.subtitle}/>
                    })}
                </div>
            }
        </div>
     )
}


export function SingleSearchResult({type,id,subtitle}:{type:'page' | 'tag',id:string,subtitle:string}){
    const t = getSearchHistory()
    function deleteSavedSearch(e:MouseEvent<HTMLDivElement, MouseEvent>){
        e.preventDefault()
    }
    return(
        <Link href='/testtetete/' className="py-2 px-6 flex gap-3 items-center cursor-pointer bg-white hover:bg-gray">
            {type == 'tag' ?
                <div className="rounded-full flex-shrink-0 relative size-11 border-[1px] border-ss items-center justify-center flex text-2xl">
                    #
                </div>
            :
                <div className="rounded-full flex-shrink-0 relative">
                    <Image className="rounded-full" src='/images/profile-img-2.jpg' alt="" width={44} height={44}></Image>
                </div>
            }
            <div className="flex flex-1 flex-col text-sm leading-[18px] relative">
                <span className="font-semibold truncate inline-block w-fit" >
                    {type == 'tag' && '#'}{id}
                </span>
                <span className="text-gray truncate">{subtitle}</span>
            </div>
            <div onClick={()=>removeSingleSearch(type,id)} className="cursor-pointer flex-shrink-0 over text-sm">
                <IconClose className="size-4 text-gray"/>
            </div>
        </Link>
    )
}