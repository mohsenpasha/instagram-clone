import { IconArrow } from "./Icons";
import SinglePost from "./SinglePost";

export function PostPopupSlider(){
    return(
        <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-60">
            <div className="flex w-[900px] relative z-50">
                <SinglePost />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between z-20 px-4">
                <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center -rotate-90 cursor-pointer">
                    <IconArrow className="size-4"/>
                </span>
                <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center rotate-90 cursor-pointer">
                    <IconArrow className="size-4"/>
                </span>
            </div>
        </div>
    )
}