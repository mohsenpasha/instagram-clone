'use client'
import Image from "next/image";
import { IconArrow, IconClose, IconDirect, IconHeart, IconPause, IconPlay } from "./Icons";
import { RefObject, useEffect, useRef, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

export function StoryList() {
    const storySlider = useRef(null);
    const activeStory = useRef(null);
    const allStory = useRef(null);
    const [storyLeftPosition, setStoryLeftPosition] = useState(0);
    const [storyList, setStoryList] = useState([true, false, false, false, false, false, false, false, false]);
    const activeIndex = storyList.findIndex(item => item == true)
    const timerStatus = useRef(true);
    const prevLeftPosition = useRef(0);
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    function fixHolderPosition() {
        if (timerStatus.current) {
            const storyCurrentWidth = activeStory.current?.getBoundingClientRect().width || 0;
            // const storyWidth = 
            const storyWidth = activeStory.current.clientWidth
            // const storyWidth = 369;
            const storyLeft = activeStory.current?.getBoundingClientRect().left || 0;
            // console.log(storyLeft)
            const centerPosition = (window.innerWidth / 2) - (storyWidth / 2);
            console.log(storyLeftPosition)
            let final_place = storyLeftPosition + (centerPosition - storyLeft)
            if(storyLeft > centerPosition){
                final_place += (storyWidth - storyCurrentWidth)
            }
            console.log(centerPosition,storyLeft)
            // console.log(storyLeft,final_place)
            prevLeftPosition.current = final_place;
            setStoryLeftPosition(final_place);
    
            timerStatus.current = false;
            setTimeout(() => {
                timerStatus.current = true;
            }, 50);
        }
    }
    useEffect(()=>{
        fixHolderPosition()
    },[storyList])
    function changeActiveStoryList(id) {
        setStoryList(storyList.map((item,index)=>{
            return index == id ? true : false
        }))
    }
    
    useEffect(() => {
        window.addEventListener('resize', fixHolderPosition);
        fixHolderPosition();
        return () => window.removeEventListener('resize', fixHolderPosition);
    }, []);
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-st z-50 flex items-center">
            <IconClose className="text-white" />
            <div style={{transformStyle:'preserve-3d', left: isUnderMd ? '50%' : storyLeftPosition }} ref={storySlider} className={`absolute top-1/2 ${isUnderMd ? '-translate-x-1/2' : ''} -translate-y-1/2 h-[100vh] w-[calc(100vh*9/16)] md:w-[1000vw] md:h-auto flex transition-all duration-300`}>
                {storyList.map((active, index) => (
                    <StoryHolder changeHandler={changeActiveStoryList} key={index} ref={active ? activeStory : allStory} index={index} status={index == activeIndex ? 'active' : index < activeIndex ? 'before' : 'after'} />
                ))}
            </div>
        </div>
    );
}
export default function StoryHolder({status,ref,changeHandler,index}:{status:'active' | 'before' | 'after',ref:RefObject<null>,changeHandler:(id:number)=>void,index:number}){
    const totalTime = useRef(5000)
    const timerRef = useRef<number | null>(null);
    const timeRemainingRef = useRef(totalTime.current)
    const [timerProgress,setTimerProgress] = useState(-100)
    const [seenStory,setSeenStory] = useState([false,false,false,false])
    const [isStoryPaused,setIsStoryPaused] = useState(false)
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    let timeOutElm : NodeJS.Timeout;
    let currentIndex = seenStory.findIndex(item => item === false)
    function nextStory(){
        if(currentIndex == seenStory.length - 1){
            changeHandler(index + 1)
        }
        else{
            setSeenStory(seenStory.map((item,index)=>{
                return index <= currentIndex ? true : false
            }))
            resetTimer()
            startTimer()
            setIsStoryPaused(false)
        }
    }
    function prevStory(){
        if(currentIndex == 0){
            changeHandler(index - 1)
        }
        else{
            setSeenStory(seenStory.map((item,index)=>{
                return index < currentIndex - 1 ? true : false
            }))
            resetTimer()
            startTimer()
            setIsStoryPaused(false)
        }
    }
    function resetTimer(){
        totalTime.current = 5000
        timeRemainingRef.current = 5000
        setTimerProgress(-100)
    }
    function resetSeenStory(){
        setSeenStory([false,false,false,false])
    }
    useEffect(()=>{
        if(timeRemainingRef.current == totalTime.current){
            startTimer()
        }
    },[seenStory])
    useEffect(()=>{
        resetTimer()
        startTimer()
        setIsStoryPaused(false)
    },[status])
    useEffect(()=>{
        if(isStoryPaused){
            clearInterval(timerRef.current!)
        }
        else{
            startTimer()
        }
    },[isStoryPaused])
    function startTimer(){
        clearInterval(timerRef.current!)
        timerRef.current = window.setInterval(() => {
            if(!isStoryPaused && status == 'active'){
                timeRemainingRef.current -= 100;
                    setTimerProgress(-1 * (timeRemainingRef.current * 100) / totalTime.current);
                    if (timeRemainingRef.current <= 0) {
                        clearInterval(timerRef.current!);
                        changeStory()
                    }
                }
                else{
                    clearInterval(timerRef.current!);
                }
            }, 100);
    }
    function changeStory(dir='N'){
        if(currentIndex < seenStory.length - 1){
            setSeenStory(seenStory.map((status,index)=>{
                return index <= currentIndex ? true : false
            }))
            resetTimer()
        }
        else{
            changeHandler(index + 1)
        }
    }
    return(
        <div style={{transform: isUnderMd ? `${status == 'active' ? ' translate(0) rotateY(0)' : status == 'before' ? 'translate(-50%) rotateY(-90deg)' : 'translate(50%) rotateY(90deg)'}` : undefined}} onClick={()=>status == 'active' ? {} : changeHandler(index)} ref={ref} className={`bg-slate-500 md:relative absolute md:h-[90vh] w-full h-full md:w-[calc(90vh*9/16)] rounded-lg transition-all duration-300 select-none ${status != 'active' ? 'md:scale-[.4] rotate-z-90 md:-mx-20 cursor-pointer' : 'md:mx-8'}`}>
            <div className={`relative z-40 bg-[linear-gradient(180deg, rgba(38, 38, 38, .8) 0%, rgba(38, 38, 38, 0) 100%);] ${status != 'active' && 'h-full flex items-center justify-center'}`}>
                {status == 'active' &&
                        <div className="w-full flex flex-nowrap gap-[2px] p-4">
                            {seenStory.map((status,indx)=>{
                                return(
                                    <span key={indx} className={`bg-white ${!status && 'bg-opacity-60'} flex-1 h-[2px] rounded-lg overflow-hidden relative`}>
                                        { indx == currentIndex &&
                                            <span style={{transform: `translateX(${timerProgress + '%'})`}} className="absolute -translate-x-full w-full h-full bg-white transition-all ease-linear duration-100"></span>
                                        }
                                    </span>
                                )
                            })}
                        </div>
                    }
                    <div className={`flex w-full ${status == 'active' ? 'justify-between' : 'justify-center'} px-4`}>
                        <div className={`${status != 'active' && 'flex-col scale-[3]'} flex gap-2 items-center`}>
                            <div className={`rounded-full flex-shrink-0 cursor-pointer ${status == 'active' ? 'size-8' : 'size-16'} items-center`}>
                                <Image className="rounded-full w-full h-full" src='/images/profile-img-2.jpg' width={status == 'active' ? 32 : 64} height={status == 'active' ? 32 : 64} alt=""></Image>
                            </div>
                            <div className={`flex items-center text-white ${status != 'active' && 'flex-col'}`}>
                                <div className="block">
                                    <div className="text-sm bg-wh pr-1 rtl:pr-0 rtl:pl-1 inline mr-1 md:mr-0 font-medium float-left rtl:float-right">
                                        afshin_bizar
                                    </div>
                                </div>
                                <div className="text-sm flex gap-2 text-white opacity-60">
                                    <div><span>3</span>h</div>
                                </div>
                            </div>
                        </div>
                        {/* {status != 'active' && */}
                            <div className="text-white">
                                <div className="p-2 cursor-pointer">
                                    {isStoryPaused ? 
                                        <span onClick={()=>setIsStoryPaused(false)}>
                                            <IconPlay className="text-white size-[16px]"/>
                                        </span>
                                        :
                                        <span onClick={()=>setIsStoryPaused(true)}>
                                            <IconPause className="text-white size-[16px]"/>
                                        </span>
                                    }
                                </div>
                                
                            </div>
                    </div>
                </div>
            <Story />
            {status == 'active' &&
                <>
                    <div className="absolute bottom-0 left-0 w-full flex items-center text-white p-4 gap-2">
                        <div className="bg-transparent border-[1px] rounded-full border-white flex-1 flex items-center p-4 py-[10px]">
                            <textarea rows={1} placeholder="replying" className="resize-none bg-transparent outline-none w-full text-white placeholder-white" name="" id=""></textarea>
                        </div>
                        <div className="flex">
                            <div className="p-2 cursor-pointer">
                                <IconHeart/>
                            </div>
                            <div className="p-2 cursor-pointer">
                                <IconDirect/>
                            </div>
                        </div>
                    </div>
                    <div className={`w-[calc(100%+96px)] h-full left-1/2 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 -z-10 flex items-center opacity-30 hover:opacity-100 ${index != 0 || currentIndex != 0 ? 'justify-between' : 'justify-end'}`}>
                        {(index != 0 || currentIndex != 0) &&
                            <span onClick={()=>prevStory()} className="-rotate-90 rounded-full bg-white size-6 flex items-center justify-center cursor-pointer">
                                <IconArrow className="size-4"/>
                            </span>
                        }
                        <span onClick={()=>nextStory()} className="rotate-90 rounded-full bg-white size-6 flex items-center justify-center cursor-pointer">
                            <IconArrow className="size-4"/>
                        </span>
                    </div>
                </>

            }

        </div>
    )
}
export function Story(){
    return(
        <div className="absolute top-0 left-0 z-0 rounded-lg w-full h-full overflow-hidden">
            {/* <Image src='/images/story-1.webp' alt="" width={1080} height={1920}></Image> */}
            <video src="/reels/reel-1.mp4" autoPlay></video>
        </div>
    )
}