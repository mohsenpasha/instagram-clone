import Image from "next/image";
import { IconClose, IconDirect, IconHeart, IconPause, IconPlay } from "./Icons";
import { useEffect, useRef, useState } from "react";

export function StoryList() {
    const storySlider = useRef(null);
    const activeStory = useRef(null);
    const allStory = useRef(null);
    const [storyLeftPosition, setStoryLeftPosition] = useState(0);
    const [storyList, setStoryList] = useState([false, false, false, true]);
    const timerStatus = useRef(true);
    const prevLeftPosition = useRef(0);
    
    function fixHolderPosition() {
        if (timerStatus.current) {
            const storyWidth = activeStory.current?.getBoundingClientRect().width || 0;
            const storyLeft = activeStory.current?.getBoundingClientRect().left || 0;
            const centerPosition = (window.innerWidth / 2) - (storyWidth / 2);
            const final_place = prevLeftPosition.current + (centerPosition - storyLeft);

            timerStatus.current = false;
            setTimeout(() => {
                timerStatus.current = true;
            }, 50);
            
            prevLeftPosition.current = final_place;
            setStoryLeftPosition(final_place);
        }
    }
    useEffect(()=>{
        fixHolderPosition()
    },[storyList])
    function changeActive(id) {
        setStoryList(storyList.map((item,index)=>{
            return index == id ? true : false
        }))
        console.log(id);
    }
    
    useEffect(() => {
        window.addEventListener('resize', fixHolderPosition);
        fixHolderPosition();
        return () => window.removeEventListener('resize', fixHolderPosition);
    }, []);
    
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-st z-50 flex items-center">
            <IconClose className="text-white" />
            <div style={{ left: storyLeftPosition }} ref={storySlider} className="absolute top-1/2 -translate-y-1/2 w-[1000vw] flex transition-all duration-300">
                {storyList.map((active, index) => (
                    <StoryHolder changeHandler={()=>changeActive(index)} key={index} ref={active ? activeStory : allStory} active={active} />
                ))}
            </div>
        </div>
    );
}
export default function StoryHolder({active,ref,changeHandler}:{active:boolean}){
    return(
        <div onClick={changeHandler} ref={ref} className={`bg-slate-500 relative h-[90vh] w-[calc(90vh*9/16)] rounded-lg transition duration-300 ${!active && 'scale-[.35] cursor-pointer'}`}>
            <div className={`relative z-40 bg-[linear-gradient(180deg, rgba(38, 38, 38, .8) 0%, rgba(38, 38, 38, 0) 100%);] ${!active && 'h-full flex items-center justify-center'}`}>
                {active &&
                        <div className="w-full flex flex-nowrap gap-[2px] p-4">
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                            <span className="bg-white bg-opacity-60 flex-1 h-[2px] rounded-lg"></span>
                        </div>
                    }
                    <div className={`flex w-full ${active ? 'justify-between' : 'justify-center'} px-4`}>
                        <div className={`${!active && 'flex-col scale-[3]'} flex gap-2 items-center`}>
                            <div className={`rounded-full flex-shrink-0 cursor-pointer ${active ? 'size-8' : 'size-16'} items-center`}>
                                <Image className="rounded-full w-full h-full" src='/images/profile-img-2.jpg' width={active ? 32 : 64} height={active ? 32 : 64} alt=""></Image>
                            </div>
                            <div className={`flex items-center text-white ${!active && 'flex-col'}`}>
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
                        {active &&
                            <div className="text-white">
                                <div className="p-2 cursor-pointer">
                                    <IconPlay className="text-white size-[16px]"/>
                                </div>
                                {/* <IconPause className="text-white size-[16px]"/> */}
                            </div>
                        }
                    </div>
                </div>
            <Story />
            {active &&
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
            }
        </div>
    )
}
export function Story(){
    return(
        <div className="absolute top-0 left-0 z-0 rounded-lg w-full h-full overflow-hidden">
            <Image src='/images/story-1.webp' alt="" width={1080} height={1920}></Image>
        </div>
    )
}