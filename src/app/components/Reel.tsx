'use client'
import Image from "next/image"
import { IconComment, IconDirect, IconHeart, IconMore, IconMute, IconPlay, IconSave, IconUnMute } from "./Icons"
import Link from "next/link"
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState, VideoHTMLAttributes } from "react"
import { useAnimationEnd } from "@/hooks/useAnimationEnd"
import { UserPreview } from "./UserPreview"
import useMediaQuery from "@/hooks/useMediaQuery"

export function ReelScroll(){
    const activeReelRef = useRef(null)
    const [sliderTop,setSliderTop] = useState(0)
    const [reelList,setReelList] = useState([true,false,false,false])
    const [isVideoMuted,setIsVideoMuted] = useState(true)
    const isScrollAllowed = useRef(true)
    const isUnderXs = useMediaQuery("(max-width: 400px)");
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    useEffect(()=>{
        window.addEventListener('keydown',(event)=>{keyboardHandler(event)})
        return ()=>{
            window.removeEventListener('keydown',(event)=>{keyboardHandler(event)}) 
        }
    },[])
    function wheelHandler(event){
        if(event.deltaY > 0){
            changeActiveReel()
        }
        else{
            changeActiveReel('prev')
        }
    }
    function keyboardHandler(event){
        if(event.key == 'ArrowUp'){
            changeActiveReel('prev')
        }
        else if(event.key == 'ArrowDown'){
            changeActiveReel()
        }
    }
    function changeActiveReel(dir: 'prev' | 'next' = 'next') {
        if (isScrollAllowed.current) {
            setReelList(prevReelList => {
                const currentIndex = prevReelList.findIndex(item => item === true);
                if (dir === 'prev' && currentIndex === 0) {
                    return prevReelList;
                } 
                else if (dir === 'next' && currentIndex === prevReelList.length - 1) {
                    return prevReelList;
                } 
                else {
                    return prevReelList.map((status, index) => {
                        if (dir === 'prev' && index === currentIndex - 1) {
                            return true;
                        } 
                        else if (dir === 'next' && index === currentIndex + 1) {
                            return true;
                        } 
                        else {
                            return false;
                        }
                    });
                }
            });
    
            isScrollAllowed.current = false;
            setTimeout(() => {
                isScrollAllowed.current = true;
            }, 300);
        }
    }
    function reelScroll(){
        const reelHeight = activeReelRef.current.getBoundingClientRect().height
        const reelTop = activeReelRef.current.getBoundingClientRect().top
        let finialTop = 0;
        if(isUnderXs){
            const currentIndex = reelList.findIndex(item => item == true)
            finialTop = reelHeight * currentIndex * -1
        }
        else{
            finialTop = sliderTop -(reelTop - ((window.innerHeight - reelHeight) / 2))
            if(isUnderMd){
                finialTop -= 20
            }
        }
        setSliderTop(finialTop)
    }
    useEffect(()=>{
        reelScroll()
    },[isUnderXs,isUnderMd])
    useEffect(()=>{
        reelScroll()
    },[reelList])

    return(
        <div onWheel={(event)=>wheelHandler(event)} onClick={reelScroll} className="flex flex-col w-full items-center relative overflow-hidden h-[100vh]">
            <div style={{top:sliderTop}} className="absolute flex transition-all duration-300 flex-col xs:gap-4 xs:pt-[5vh]">
                {reelList.map((status,index)=>{
                    return <SingleReel isVideoMuted={isVideoMuted} setIsVideoMuted={setIsVideoMuted} active={status} key={index} ref={status ? activeReelRef : null}/>
                })}
            </div>
        </div>
    ) 
}
export function SingleReel({active,ref,isVideoMuted,setIsVideoMuted}:{active:boolean,ref:RefObject<null> | null,isVideoMuted:boolean,setIsVideoMuted:Dispatch<SetStateAction<boolean>>}){
    const videoRef = useRef(null)
    const [isVideoPaused,setIsVideoPaused] = useState(false)
    const [isPlayIconAnimationStarted,setIsPlayIconAnimationStarted] = useState(false)
    const [isCaptionOpen,setIsCaptionOpen] = useState(false)
    const isUnderXs = useMediaQuery("(max-width: 400px)");
    const videoIconRef = useAnimationEnd(() => {
        setIsPlayIconAnimationStarted(false)
        });
    function toggleSound(){
        if(videoRef.current){
            setIsVideoMuted(!videoRef.current.muted)
            videoRef.current.muted = !videoRef.current.muted
        }
    }
    function videoPlayToggle(){
        if(videoRef.current){
            if(videoRef.current.paused){
                videoRef.current.play()
                setIsVideoPaused(false)
                setIsPlayIconAnimationStarted(true)
            }
            else{
                setIsVideoPaused(true)
                videoRef.current.pause()
                // setIsPlayIconAnimationStarted(true)
            }
        }
    }
    useEffect(()=>{
        if(active && !isVideoPaused){
            videoRef.current.play()
        }
        if(!active){
            videoRef.current.pause()
        }
    })
    return(
        <div ref={ref} className="flex gap-3 xs:static relative">
            <div className="xs:h-[90vh] xs:w-[calc(90vh*9/16)] h-[calc(100vh-48px)] w-[100vw] bg-black relative xs:rounded-md overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full z-10 flex items-center justify-center" onClick={isUnderXs ? toggleSound : videoPlayToggle}>
                    {(isVideoPaused || isPlayIconAnimationStarted) && 
                        <div ref={videoIconRef} className={`p-6 bg-black bg-opacity-40 rounded-full flex items-center justify-center ${isPlayIconAnimationStarted ? 'animate-scaleOut' :'animate-scale'}`}>
                            <IconPlay className="text-white"/>
                        </div>
                    }
                </div>
                <div className={`${isVideoMuted && 'hidden'} animate-scaleInOut xs:animate-none scale-0 xs:scale-100 absolute xs:right-2 xs:left-auto xs:top-2 top-1/2 left-1/2 xs:-translate-x-0 xs:-translate-y-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 bg-white text-white flex items-center justify-center bg-opacity-20 hover:bg-opacity-15 size-8 cursor-pointer`} onClick={toggleSound}>
                    <IconUnMute className="size-4"/>
                </div>
                <div className={`${!isVideoMuted && 'hidden'} animate-scaleInOut xs:animate-none scale-0 xs:scale-100 absolute xs:right-2 xs:left-auto xs:top-2 top-1/2 left-1/2 xs:-translate-x-0 xs:-translate-y-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 bg-white text-white flex items-center justify-center bg-opacity-20 hover:bg-opacity-15 size-8 cursor-pointer`} onClick={toggleSound}>
                    <IconMute className="size-4"/>
                </div>
                <div onClick={()=>isCaptionOpen ? setIsCaptionOpen(false) : undefined} className={`absolute bottom-0 left-0 w-full xs:h-auto flex flex-col justify-end py-4 z-20 text-white pr-8 xs:pr-0 ${isCaptionOpen ? 'from-[#00000000] to-[#000000AA] bg-gradient-to-b h-full' : ''}`}>
                    <UserPreview isReel={true}/>
                    <ReelCaption isCaptionOpen={isCaptionOpen} setIsCaptionOpen={setIsCaptionOpen}/>
                </div>
                <video ref={videoRef} className="h-full w-full object-cover" muted={isVideoMuted} loop autoPlay={active} src="/reels/reel-2.mp4"></video>
            </div>
            <div className="xs:static text-white xs:text-black absolute bottom-0 right-0 w-12 flex flex-col justify-end gap-2 items-center z-30">
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconHeart className="flex-shrink-0"/>
                    <span className="text-xs">2M</span>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconComment className="flex-shrink-0"/>
                    <span className="text-xs">2M</span>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconDirect className="flex-shrink-0"/>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconSave className="flex-shrink-0"/>
                </div>
                <div className="p-2 flex items-center flex-col gap-1">
                    <IconMore className="flex-shrink-0"/>
                </div>

                <Link href='#' className="flex my-2 items-center flex-col gap-1 rounded-[4px] border-[1px] border-black size-6 overflow-hidden hover:opacity-40">
                    <Image src='/images/profile-img-2.jpeg' width={24} height={24} alt={""}></Image>
                </Link>
            </div>
        </div>
    )
}
export function ReelCaption({isCaptionOpen,setIsCaptionOpen}:{isCaptionOpen:boolean,setIsCaptionOpen:Dispatch<SetStateAction<boolean>>}){
    function toggleFullCaption(){
        setIsCaptionOpen(!isCaptionOpen)
    }
        return(
            <div onClick={toggleFullCaption} className={`${isCaptionOpen ? 'max-h-44 overflow-y-auto' : 'max-h-[18px] overflow-hidden'} px-4 text-sm flex gap-1 transition-all cursor-pointer`}>
                <div className={`${isCaptionOpen ? 'w-full' : 'w-11/12 overflow-hidden'}`}>
                    <span className={!isCaptionOpen ? 'w-80 inline-block' : undefined}>
                        test test test test test test test test test test test test test test test test test test test test test</span>
                </div>
                {!isCaptionOpen && 
                    <span className="flex-shrink-0 opacity-70 cursor-pointer">… more</span>
                }
            </div>
        )
}