import Image from "next/image";
import Link from "next/link";
import PostHover from "./PostHover";
import { IconPosts, IconReels, IconView } from "./Icons";
type postType = {
    isReel: boolean
}
export default function PostPreview({isReel}:postType){
    return(
        <Link href='#' className={"group overflow-hidden relative " + (isReel ? "w-[calc(25%-3px)] aspect-[2/3]" : "w-[calc(33.33%-3px)] aspect-square")}>
            <IconReels white className="absolute right-2 top-2"/>
            <Image src='/images/post-prev-1.jpg' alt="" width={350} height={350}></Image>
            <PostHover />
            {isReel && 
                <div className="absolute bottom-4 left-4 size-[16px] text-white flex w-fit gap-1 items-center group-hover:opacity-0">
                    <IconView className="size-[16px]"/>
                    <span className="font-bold">192</span>
                </div>
            }
        </Link>
    )
}