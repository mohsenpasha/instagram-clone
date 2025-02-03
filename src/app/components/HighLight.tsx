'use client'

import Image from "next/image"

export default function HighLight(){
    return(
        <div className="cursor-pointer flex flex-col items-center w-fit gap-1 md:gap-2 px-[15px] py-[10px]">
            <div className="flex size-[64px] md:size-[87px] rounded-full justify-center items-center border-[1px] border-s">
                <div className="rounded-full size-[56px] md:size-[77px] overflow-hidden">
                    <Image className="object-cover size-full" src='/images/food-1.png' alt="" width={77} height={77} />
                </div>
            </div>
            <span>test</span>
        </div>
    )
}