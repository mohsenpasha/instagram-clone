'use client'
import { activateStoriesHolder, changeStoryToggle, changeStoryType } from "@/store/slices/storySlice"
import { RootState } from "@/store/store"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function StorySlider() {
    const storiesHolder = useSelector((state : RootState)=> state.story.storiesHolder)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [translateX, setTranslateX] = useState(0)
    const [maxTranslateX, setMaxTranslateX] = useState(0)
    const dispatch = useDispatch()
    const itemScrollAmount = 400

    useEffect(() => {
        const updateMaxTranslate = () => {
            const containerWidth = containerRef.current?.offsetWidth || 0
            const contentWidth = contentRef.current?.scrollWidth || 0
            const max = containerWidth - contentWidth
            setMaxTranslateX(max < 0 ? max : 0)
        }

        updateMaxTranslate()
        window.addEventListener('resize', updateMaxTranslate)

        return () => {
            window.removeEventListener('resize', updateMaxTranslate)
        }
    }, [])

    const slideLeft = () => {
        setTranslateX(prev => Math.min(prev + itemScrollAmount, 0))
    }

    const slideRight = () => {
        setTranslateX(prev => Math.max(prev - itemScrollAmount, maxTranslateX))
    }

    function toggleHighlight(currentIndex:number){
            dispatch(changeStoryToggle(true))
            dispatch(changeStoryType('homeStories'))
            dispatch(activateStoriesHolder(currentIndex))
        }

    if(!storiesHolder) return
    return (
        <div ref={containerRef} className="w-full overflow-hidden relative py-4">
            <div
                ref={contentRef}
                style={{ transform: `translateX(${translateX}px)` }}
                className="flex transition-transform duration-300 ease-in-out"
            >
                {storiesHolder.map((item, index) => (
                    <div onClick={()=>toggleHighlight(index)} key={index} className="cursor-pointer flex flex-col items-center w-fit gap-1 px-[15px] py-[10px]">
                        <div className="flex size-[64px] rounded-full justify-center items-center border-[1px] border-s [background:conic-gradient(from_180deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)]">
                            <div className="rounded-full size-[58px] bg-white overflow-hidden flex items-center justify-center">
                                <Image className="object-cover size-[56px] rounded-full border-[1px] border-ss" src={item.thumbnail || '/images/profile-img.jpeg'} alt="" width={56} height={56} />
                            </div>
                        </div>
                        <span className="text-xs">{item.name}</span>
                    </div>
                ))}
            </div>

            {translateX > maxTranslateX && (
                <span
                    onClick={slideRight}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-[position:-162px_-98px] bg-[url(/images/icons.png)] w-[30px] h-[30px] cursor-pointer z-10"
                ></span>
            )}
            {translateX < 0 && (
                <span
                    onClick={slideLeft}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rotate-180 bg-[position:-162px_-98px] bg-[url(/images/icons.png)] w-[30px] h-[30px] cursor-pointer z-10"
                ></span>
            )}
        </div>
    )
}
