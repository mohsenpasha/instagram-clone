import Image from "next/image";

export default function PostHover(){
    return(
        <div className="absolute w-full h-full top-0 right-0 items-center flex bg-black bg-opacity-25 opacity-0 hover:opacity-100 z-10">
            <div className="flex justify-center gap-x-6 md:gap-x-8 w-full flex-wrap">
                <div className="text-white flex items-center gap-2">
                    <Image src='/images/reel-white.svg' alt="" height={18} width={18}></Image>
                    <span>142</span>
                </div>
                <div className="text-white flex items-center gap-2">
                    <Image src='/images/reel-white.svg' alt="" height={18} width={18}></Image>
                    <span>124</span>
                </div>
            </div>
        </div>
    )
}