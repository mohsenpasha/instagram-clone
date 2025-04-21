'use client'
import Image from "next/image";
import { IconArrow, IconClose, IconDirect, IconHeart, IconMute, IconPause, IconPlay, IconUnMute } from "./Icons";
import { RefObject, useEffect, useRef, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { activateStoriesHolder, changeIsStoryMuted, changeStoryToggle, resetStoriesHolder, resetUserStories, seenStoriesHolderStory, seenUserStories } from "@/store/slices/storySlice";
import { useTranslation } from "react-i18next";

export function StoryList() {
    const storySlider = useRef(null);
    const activeStory = useRef<HTMLElement>(null);
    const allStory = useRef(null);
    const [storyLeftPosition, setStoryLeftPosition] = useState(0);
    const storyListType = useSelector((state: RootState)=> state.story.storyListType)
    const storiesHolder = useSelector((state: RootState)=> state.story.storiesHolder)
    const userStories = useSelector((state: RootState)=> state.story.userStories)
    const activeIndex = storiesHolder?.findIndex(item => item.activeStatus == true)
    const [closetoggle,setCloseToggle] = useState(false)
    const timerStatus = useRef(true);
    const prevLeftPosition = useRef(0);
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    const dispatch = useDispatch()
    function fixHolderPosition() {
        if (timerStatus.current && activeStory.current) {
            const storyCurrentWidth = activeStory.current?.getBoundingClientRect().width || 0;
            const storyWidth = activeStory.current.clientWidth
            const storyLeft = activeStory.current?.getBoundingClientRect().left || 0;
            const centerPosition = (window.innerWidth / 2) - (storyWidth / 2);
            let final_place = storyLeftPosition + (centerPosition - storyLeft)
            if(storyLeft > centerPosition){
                final_place += (storyWidth - storyCurrentWidth)
            }
            prevLeftPosition.current = final_place;
            setStoryLeftPosition(final_place);
    
            timerStatus.current = false;
            setTimeout(() => {
                timerStatus.current = true;
            }, 50);
        }
    }
    useEffect(()=>{
        if(!storiesHolder) return
        if(!activeStory.current){
            setTimeout(() => {
                fixHolderPosition()
            }, 100);
        }
        else{
            fixHolderPosition()
        }
    },[storiesHolder])
    useEffect(()=>{
        if(!userStories) return
        if(!activeStory.current){
            setTimeout(() => {
                fixHolderPosition()
            }, 100);
        }
        else{
            fixHolderPosition()
        }
    },[userStories])
    function changeActiveStoryList(id:number) {
        dispatch(activateStoriesHolder(id))
    }
    
    useEffect(() => {
        window.addEventListener('resize', fixHolderPosition);
        fixHolderPosition();
        return () => window.removeEventListener('resize', fixHolderPosition);
    }, []);
    return (
        <div dir="ltr" className="fixed top-0 left-0 w-full h-full bg-st z-50 flex items-center">
            <span onClick={()=>setCloseToggle(true)} className="absolute top-4 right-4 cursor-pointer">
                <IconClose className="text-white" />
            </span>
            <div style={{transformStyle:'preserve-3d', left: isUnderMd ? '50%' : storyLeftPosition }} ref={storySlider} className={`absolute top-1/2 ${isUnderMd ? '-translate-x-1/2' : ''} -translate-y-1/2 h-[100vh] w-[calc(100vh*9/16)] md:w-[1000vw] md:h-auto flex transition-all duration-300`}>
                {storyListType == 'highlighs' || storyListType == 'homeStories' ?
                    (
                        activeIndex != null && storiesHolder?.map((item, index) => (
                            <StoryHolder closeStatus={closetoggle} changeHandler={changeActiveStoryList} key={index} ref={item.activeStatus ? activeStory : allStory} listIndex={index} status={index == activeIndex ? 'active' : index < activeIndex ? 'before' : 'after'} />
                        ))
                    )
                :
                    <StoryHolder closeStatus={closetoggle} changeHandler={changeActiveStoryList} ref={activeStory} listIndex={0} status={'active'} />
                }
            </div>
        </div>
    );
}

type singleStoryyType = {
        file:string,
        media_type: 'image' | 'video',
        activeStatus:boolean,
        created_at:{
        t_ago: string,
            t: string
        }
  }

export default function StoryHolder({status,ref,changeHandler,listIndex,closeStatus}:{status:'active' | 'before' | 'after',ref:RefObject<HTMLElement>,changeHandler:(id:number)=>void,listIndex:number,closeStatus:boolean}){
    const storyListType = useSelector((state: RootState)=> state.story.storyListType)
    const storiesHolder = useSelector((state: RootState)=> state.story.storiesHolder)
    const userStories = useSelector((state: RootState)=> state.story.userStories)
    const isStoryMuted = useSelector((state: RootState)=> state.story.isStoryMuted)
    const currentVisitingUser = useSelector((state: RootState)=> state.currentUser.currentVisitingUser)
    const totalTime = useRef(5000)
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const timeRemainingRef = useRef(totalTime.current)
    const [timerProgress,setTimerProgress] = useState(-100)
    const [isStoryPaused,setIsStoryPaused] = useState(false)
    const isUnderMd = useMediaQuery("(max-width: 768px)");
    const [storyList,setStoryList] = useState<singleStoryyType[] | []>([])
    const [currentIndex,setCurrentindex] = useState<number | null>(null)
    const currentIndexRef = useRef(currentIndex)
    const storyListRef = useRef(storyList)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLastStory,setIsLastStory] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation();
    
    function closeHandler(){
        console.log('close handler')
        clearInterval(timerRef.current!)
        dispatch(resetStoriesHolder())
        dispatch(resetUserStories())
        dispatch(changeStoryToggle(false))
    }
    function nextStory(){
        console.log('next story')
        if(storyListType == 'userStory' && currentIndexRef.current == storyListRef.current.length - 1){
            closeHandler()
            return
        }
        if((storyListType == 'highlighs' || storyListType == 'homeStories') && currentIndexRef.current == storyListRef.current.length - 1){
            if(!storiesHolder) return
            if(listIndex == storiesHolder?.length - 1){
                closeHandler()
                return
            }
        }
        if(videoRef.current){
            videoRef.current.pause()
        }
        if(currentIndexRef.current == storyListRef.current.length - 1){
            if(storyListType == 'highlighs' || storyListType == 'homeStories'){
                changeHandler(listIndex + 1)
            }
        }
        else{
            if(storyListType == 'highlighs' || storyListType == 'homeStories'){
                dispatch(seenStoriesHolderStory([listIndex,currentIndexRef.current]))
            }
            else{
                dispatch(seenUserStories(currentIndexRef.current))
            }
        }
    }
    function prevStory(){
        setIsStoryPaused(false)
        if(videoRef.current){
            videoRef.current.pause()
        }
        if(currentIndexRef.current == null) return
        if(currentIndexRef.current == 0){
            changeHandler(listIndex - 1)
        }
        else{
            if(storyListType == 'highlighs' || storyListType == 'homeStories'){
                dispatch(seenStoriesHolderStory([listIndex,currentIndexRef.current - 2]))
            }
            else{
                dispatch(seenUserStories(currentIndexRef.current - 2))
            }
            // resetTimer()
            // startTimer()
        }
    }
    function resetTimer(){
        setTimeout(() => {
            if(videoRef.current){
                totalTime.current = videoRef.current.duration * 1000
                timeRemainingRef.current = videoRef.current.duration * 1000
            }
            else{
                totalTime.current = 5000
                timeRemainingRef.current = 5000
            }
        }, 100);
        setTimerProgress(-100)
    }
    useEffect(()=>{
        if(!closeStatus) return
        closeHandler()
    },[closeStatus])
    useEffect(() => {
        currentIndexRef.current = currentIndex
        if(storyListType == 'userStory' && currentIndex == storyListRef.current.length - 1){
            setIsLastStory(true)
        }
        else if((storyListType == 'highlighs' || storyListType == 'homeStories') && currentIndexRef.current == storyList.length - 1){
            if(!storiesHolder) return
            if(listIndex == storiesHolder?.length - 1)
            setIsLastStory(true)
        }
        else{
            setIsLastStory(false)
        }
    }, [currentIndex])
    
    useEffect(() => {
        storyListRef.current = storyList
    }, [storyList])
    useEffect(()=>{
        if(!storiesHolder) return
        if(storyListType == 'userStory') return
        setStoryList(storiesHolder[listIndex].stories as singleStoryyType[])
            resetTimer()
            startTimer()
            setIsStoryPaused(false)
    },[storiesHolder])
    useEffect(()=>{
        if(!userStories) return
        if(storyListType != 'userStory') return
        setStoryList(userStories)
            resetTimer()
            startTimer()
            setIsStoryPaused(false)
    },[userStories])
    useEffect(() => {
        if(!videoRef.current) return
        const video : HTMLVideoElement = videoRef.current;
        
        if (status === 'active') {
            video.currentTime = 0;
            video.play();
            const timeout = setTimeout(() => {
                video.play().catch(err => console.error("Video play error:", err));
            }, 100);
            resetTimer();
            startTimer();
            setIsStoryPaused(false);
    
            return () => clearTimeout(timeout);
        } else {
            video.pause();
        }
    }, [status]);
    useEffect(()=>{
        if(storyList.length == 0) return
        setCurrentindex(storyList.findIndex(item => item.activeStatus === false))
    },[storyList])
    useEffect(()=>{
        if(isStoryPaused){
            clearInterval(timerRef.current!)
            if(videoRef.current){
                videoRef.current.pause()
            }
        }
        else{
            startTimer()
            if(videoRef.current){
                videoRef.current.play()
            }
        }
    },[isStoryPaused])
    function startTimer(){
        clearInterval(timerRef.current!)
        timerRef.current = setInterval(() => {
            if(!isStoryPaused && status == 'active'){
                timeRemainingRef.current -= 100;
                    setTimerProgress(-1 * (timeRemainingRef.current * 100) / totalTime.current);
                    if (timeRemainingRef.current <= 0) {
                        clearInterval(timerRef.current!);
                        nextStory()
                    }
                }
                else{
                    clearInterval(timerRef.current!);
                }
            }, 100);
    }
    if(storyList.length == 0 || currentIndex == null || currentIndex == -1) return
    return(
        <div style={{transform: isUnderMd ? `${status == 'active' ? ' translate(0) rotateY(0)' : status == 'before' ? 'translate(-50%) rotateY(-90deg)' : 'translate(50%) rotateY(90deg)'}` : undefined}} onClick={()=>status == 'active' ? {} : changeHandler(listIndex)} ref={ref} className={`bg-slate-500 md:relative absolute md:h-[90vh] w-full h-full md:w-[calc(90vh*9/16)] rounded-lg transition-all duration-300 select-none ${status != 'active' ? 'md:scale-[.4] rotate-z-90 md:-mx-20 cursor-pointer' : 'md:mx-8'}`}>
            {status != 'active' &&
                <div className="bg-[linear-gradient(180deg,#26262699,#26262600,#000)] absolute top-0 left-0 w-full h-full z-10"></div>
            }
            <div className={`relative z-40 bg-[linear-gradient(180deg, rgba(38, 38, 38, .8) 0%, rgba(38, 38, 38, 0) 100%);] ${status != 'active' && 'h-full flex items-center justify-center'}`}>
                {status == 'active' &&
                        <div className="w-full flex flex-nowrap gap-[2px] p-4">
                            {storiesHolder && storyList.map((story,indx)=>{
                                return(
                                    <span key={indx} className={`bg-white ${!story.activeStatus && 'bg-opacity-60'} flex-1 h-[2px] rounded-lg overflow-hidden relative`}>
                                        { indx == currentIndex &&
                                            <span style={{transform: `translateX(${timerProgress + '%'})`}} className="absolute -translate-x-full w-full h-full bg-white transition-all ease-linear duration-100"></span>
                                        }
                                    </span>
                                )
                            })}
                        </div>
                    }
                    <div className={`flex w-full ${status == 'active' ? 'justify-between' : 'justify-center'} px-4`}>
                        <div className={`${status != 'active' && 'flex-col scale-[3] ml-12'} flex gap-2`}>
                            <div className={`rounded-full flex-shrink-0 cursor-pointer ${status == 'active' ? 'size-8' : 'size-16'} items-center`}>
                                <Image className="rounded-full w-full h-full object-cover" src={
                                    storyListType == 'highlighs' || storyListType == 'homeStories'  ? 
                                    storiesHolder && storiesHolder[listIndex].thumbnail
                                    :
                                    currentVisitingUser && currentVisitingUser.profile_pic || '/images/profile-img.jpeg'
                                }
                                 width={status == 'active' ? 32 : 64} height={status == 'active' ? 32 : 64} alt=""></Image>
                            </div>
                            <div className={`flex items-center text-white ${status != 'active' && 'flex-col'}`}>
                                <div className="block">
                                    <div className="text-sm bg-wh pr-1 rtl:pr-0 rtl:pl-1 inline mr-1 md:mr-0 font-medium float-left rtl:float-right">
                                        {storyListType == 'highlighs' || storyListType == 'homeStories'
                                        ? 
                                            <span>{storiesHolder && storiesHolder[listIndex].name}</span>
                                        :
                                            <span>{currentVisitingUser && currentVisitingUser.username}</span>
                                        }
                                    </div>
                                </div>
                                <div className="text-sm flex gap-2 text-white opacity-60">
                                    <div><span>{storyList[currentIndex].created_at.t_ago}</span>{t(storyList[currentIndex].created_at.t)}</div>
                                </div>
                            </div>
                        </div>
                        {/* {status != 'active' && */}
                            <div className="text-white flex gap-1">
                                <div className="p-2 cursor-pointer">
                                    {storyList[currentIndex].media_type == 'video' && (
                                        isStoryMuted ? 
                                        <span onClick={()=>dispatch(changeIsStoryMuted(false))}>
                                                <IconMute className="size-4"/>
                                            </span>
                                        :
                                        <span onClick={()=>dispatch(changeIsStoryMuted(true))}>
                                                <IconUnMute className="size-4"/>
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="p-2 cursor-pointer">
                                    {isStoryPaused ? 
                                        <span onClick={()=>setIsStoryPaused(false)}>
                                            <IconPlay className="text-white size-4"/>
                                        </span>
                                        :
                                        <span onClick={()=>setIsStoryPaused(true)}>
                                            <IconPause className="text-white size-4"/>
                                        </span>
                                    }
                                </div>
                                
                            </div>
                    </div>
                </div>
                {storyList && currentIndex != null &&
                    // <Story mediaUrl={storyList[currentIndex].file} mediaType={storyList[currentIndex].media_type} />                    
                        <div className="absolute top-0 left-0 z-0 rounded-lg w-full h-full overflow-hidden">
                        {storyList[currentIndex].media_type == 'video'?
                            <video ref={videoRef} src={storyList[currentIndex].file} autoPlay={status == 'active'} muted={isStoryMuted}></video>
                        :
                            <Image src={storyList[currentIndex].file} alt="" width={1080} height={1920}></Image>

                        }
                    </div>
                }
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
                    <div className={`w-[calc(100%+96px)] h-full left-1/2 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 -z-10 flex items-center opacity-30 hover:opacity-100 ${listIndex != 0 || currentIndex != 0 ? 'justify-between' : 'justify-end'}`}>
                        {(listIndex != 0 || currentIndex != 0) &&
                            <span onClick={()=>prevStory()} className="-rotate-90 rounded-full bg-white size-6 flex items-center justify-center cursor-pointer">
                                <IconArrow className="size-4"/>
                            </span>
                        }
                        {
                            !isLastStory && 
                            <span onClick={()=>nextStory()} className="rotate-90 rounded-full bg-white size-6 flex items-center justify-center cursor-pointer">
                                <IconArrow className="size-4"/>
                            </span>
                        }
                    </div>
                </>

            }

        </div>
    )
}

