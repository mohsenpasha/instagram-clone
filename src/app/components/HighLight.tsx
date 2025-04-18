'use client'

import { activateStoriesHolder, changeStoryToggle, changeStoryType } from "@/store/slices/storySlice"
import Image from "next/image"
import { useDispatch } from "react-redux"

export default function HighLight({thumbnail,name,currentIndex}:{thumbnail:string,name:string,currentIndex:number}){
    const dispatch = useDispatch()
    function toggleHighlight(){
        dispatch(changeStoryToggle(true))
        dispatch(changeStoryType('highlighs'))
        dispatch(activateStoriesHolder(currentIndex))
    }
    return(
        <div onClick={()=>toggleHighlight()} className="cursor-pointer flex flex-col items-center w-fit gap-1 md:gap-2 px-[15px] py-[10px]">
            <div className="flex size-[64px] md:size-[88px] rounded-full justify-center items-center border-[1px] border-s [background:conic-gradient(from_180deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)]">
                <div className="rounded-full flex bg-white size-[62px] md:size-[82px] items-center justify-center overflow-hidden">
                    <Image className="object-cover size-[56px] md:size-[77px] rounded-full" src={thumbnail} alt="" width={160} height={160} />
                </div>
            </div>
            <span>{name}</span>
        </div>
    )
}