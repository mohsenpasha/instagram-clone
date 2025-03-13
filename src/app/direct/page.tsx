'use client'
import DirectChatSide, { ChatSide } from "@/components/Direct";

export default function DirectPage(){
    return(
        <div className="md:w-[calc(100vw-74px)] w-full flex">
            <DirectChatSide/>
            <div className="flex flex-1">
                <ChatSide />
            </div>
        </div>
    )
}