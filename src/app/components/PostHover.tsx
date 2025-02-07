import Image from "next/image";
import { IconComment, IconHeart } from "./Icons";

export default function PostHover(){
    return(
        <div className="absolute w-full h-full top-0 right-0 items-center flex bg-black bg-opacity-25 opacity-0 hover:opacity-100 z-10">
            <div className="flex justify-center gap-x-6 md:gap-x-6 w-full flex-wrap">
                <div className="text-white flex items-center gap-1">
                    <IconHeart className="size-[18px]" active/>
                    {/* <IconHeart/> */}
                    <span className="font-bold">142</span>
                </div>
                <div className="text-white flex items-center gap-1">
                    <IconComment className="size-[18px]" active/>
                    <span className="font-bold">124</span>
                </div>
            </div>
        </div>
    )
}