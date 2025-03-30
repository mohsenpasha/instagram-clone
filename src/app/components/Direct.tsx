'use client'

import Image from "next/image";
import { IconClose, IconNewMessage } from "./Icons";
import Link from "next/link";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Dispatch, SetStateAction, useState } from "react";

export default function DirectChatSide(){
    const [newMessagePopupToggle,setNewMessagePopupToggle] = useState(false)
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    return(
        <div className="flex flex-col md:w-[397px] border-r-[1px] rtl:border-l-[1px] rtl:border-r-0 border-ss md:h-[100vh] h-[calc(100vh-48px)] overflow-auto">
            <div className="flex w-full md:justify-between justify-center items-center p-6 ">
                <span className="text-xl font-bold md:inline-block hidden">
                    omp1.38.21380
                </span>
                <span onClick={()=>setNewMessagePopupToggle(true)} className="cursor-pointer md:pt-0 pt-2">
                    <IconNewMessage/>
                </span>
            </div>
            {!isUnderMd && 
                <DirectNotes/>
            }
            <DirectChatList/>
            {newMessagePopupToggle && 
                <NewMessagePopup closePopup={()=>setNewMessagePopupToggle(false)}/>
            }
        </div>
        
    )
}

export function ChatSide(){
    return(
        <div className="w-full flex flex-col">
            <ChatHeader/>
            <MessagesSection/>
            <MessageInput mode="invite"/>
        </div>
    )
}

export function ChatHeader(){
    return(
        <div className="flex w-full p-2 px-6 h-[74] items-center bg-white border-b-[1px] border-ss gap-3">
            <div className="rounded-full border-[1px] border-ss overflow-hidden">
                <Image src='/images/profile-img.jpeg' alt="" width={44} height={44}></Image>
            </div>
            <div className="flex flex-col gap-1 font-medium">
                mohsen
            </div>
        </div>
    )
}

export function MessagesSection(){
    return(
        <div className="flex-1">
            <MessagesStarterInfo/>
        </div>
    )
}
export function MessagesStarterInfo(){
    return(
        <div className="w-full flex flex-col justify-center items-center gap-4 mt-8 mb-3">
            <div className="size-24 rounded-full border-[1px] border-ss overflow-hidden">
                <Image src='/images/profile-img.jpeg' alt="" width={96} height={96}></Image>
            </div>
            <div className="flex flex-col gap-1 font-medium text-xl text-center">
                <span>
                    mohsen
                </span>
                <div className="text-gray font-normal text-sm flex justify-center items-center">
                    <span>omp.1.38.213.80</span>
                    <span className="size-2 leading-[0] mx-[2px]">.</span>
                    <span>Instagram</span>
                </div>
            </div>
            <Link className="px-4 bg-gray hover:bg-grayer leading-8 text-sm rounded-md font-medium" href='#'>View profile</Link>
        </div>
    )
}
export function MessageInput({mode='input'}:{mode?: 'invite' | 'input'}){
    return(
        <div className="h-16 border-t-[1px] border-ss">
            {mode == 'invite' ?
                <div className="flex flex-col justify-center items-center h-full">
                    <span className="text-[15px] font-medium">Invite sent</span>
                    <span className="text-[#8E8E8E] text-xs">You can send more messages after your invite is accepted.</span>
                </div>
                :
                <div>
                    input
                </div>
            }
        </div>
    )
}
export function DirectNotes(){
    return(
        <div className="flex p-6 w-full py-9">
            <DirectNote/>
        </div>
    )
}
export function DirectNote(){
    return(
        <div className="rounded-full flex flex-col relative justify-center items-center">
            <Image className="rounded-full border-[1px] border-ss" src='/images/profile-img.jpeg' alt="" width={74} height={74}></Image>
            <span className="text-xs text-gray">
                your note
            </span>
            <div className="absolute rounded-xl bg-white left-0 top-0 -translate-y-1/2 w-16 h-11 text-gray text-xs p-2 shadow-[4px_0px_8px_rgba(0,0,0,.1)]">
                Note
            </div>
        </div>
    )
}
export function DirectChatList(){
    return(
        <div className="flex flex-1 flex-col">
            <div className="md:flex hidden w-full justify-between items-center p-6">
                <span className="font-bold">Messages</span>
                <span className="text-gray font-medium text-sm active:opacity-50 cursor-pointer">Requests</span>
            </div>
            {/* <div className="flex flex-1 justify-center items-center text-sm">
                No messages found.
            </div> */}
            <div className="flex flex-1 flex-col">
                <SingleChatPreview/>
            </div>
        </div>
    )
}

export function SingleChatPreview(){
    return(
        <div className="flex w-full h-[72px] p-2 px-6 items-center bg-white hover:bg-gray gap-3 cursor-pointer">
            <div className="rounded-full border-[1px] border-ss overflow-hidden">
                <Image src='/images/profile-img.jpeg' alt="" width={56} height={56}></Image>
            </div>
            <div className="text-sm hidden md:flex flex-col gap-1">
                <div>mohsen</div>
                <div className="flex text-xs items-center text-gray">
                    <span>You: test</span>
                    <span className="size-[1px] mx-1 leading-[0] pb-2">.</span>
                    <span>13m</span>
                </div>
            </div>
        </div>
    )
}


export function NewMessagePopup({closePopup}:{closePopup:() => void}){
    return(
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-hidden z-50">
            <div className="flex flex-col bg-white md:w-[548px] h-[474px] sm:w-10/12 w-11/12 rounded-lg">
                <div className="flex items-center justify-center relative py-2 border-b-[1px] border-ss">
                    <span onClick={closePopup} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        <IconClose className="size-4"/>
                    </span>
                    <span className="font-bold">New message</span>
                </div>
                <div className="flex px-4 gap-4 items-center border-b-[1px] border-ss">
                    <span className="font-medium">
                        To:
                    </span>
                    <div className="text-gray placeholder:text-gray flex-1">
                        <input className="w-full outline-none border-none py-2" type="text" placeholder="Search..." />
                    </div>
                </div>
                <DirectSearchResult />
                <div className="p-4">
                    <div className="w-full bg-bl opacity-50 text-white flex justify-center items-center py-3 rounded-lg">
                        chat
                    </div>
                </div>
            </div>
        </div>
    )
}

function DirectSearchResult(){
    return(
        <div className="flex-1 overflow-auto">
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
            <SingleSearchPreview/>
        </div>
    )
}

export function SingleSearchPreview(){
    return(
        <div className="cursor-pointer relative flex w-full p-2 px-6 items-center bg-white hover:bg-gray gap-3">
            <div className="rounded-full border-[1px] border-ss overflow-hidden">
                <Image src='/images/profile-img.jpeg' alt="" width={44} height={44}></Image>
            </div>
            <div className="text-sm hidden md:flex flex-col gap-1">
                <div>mohsen</div>
            </div>
            <span className="absolute top-1/2 right-4 rtl:right-auto rtl:left-4 -translate-y-1/2 size-6 border-[1px] border-ss rounded-full">
                    
            </span>
        </div>
    )
}