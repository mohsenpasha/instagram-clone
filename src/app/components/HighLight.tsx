'use client'

import { activateHighlight, changeStoryToggle, changeStoryType } from "@/store/slices/storySlice"
import Image from "next/image"
import { useDispatch } from "react-redux"

export default function HighLight({thumbnail,name,currentIndex}:{thumbnail:string,name:string,currentIndex:number}){
    const dispatch = useDispatch()
    function toggleHighlight(){
        dispatch(changeStoryToggle(true))
        dispatch(changeStoryType('highlighs'))
        dispatch(activateHighlight(currentIndex))
    }
    return(
        <div onClick={()=>toggleHighlight()} className="cursor-pointer flex flex-col items-center w-fit gap-1 md:gap-2 px-[15px] py-[10px]">
            <div className="flex size-[64px] md:size-[87px] rounded-full justify-center items-center border-[1px] border-s">
                <div className="rounded-full size-[56px] md:size-[77px] overflow-hidden">
                    <Image className="object-cover size-full" src={thumbnail} alt="" width={160} height={160} />
                </div>
            </div>
            <span>{name}</span>
        </div>
    )
}