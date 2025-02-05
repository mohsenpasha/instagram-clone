import Image from "next/image";
import Link from "next/link";
import PostHover from "./PostHover";
import { IconReels } from "./Icons";

export default function PostPreview(){
    return(
        <Link href='#' className="w-[calc(33.33%-3px)] aspect-square overflow-hidden relative">
            <IconReels white className="absolute right-2 top-2"/>
            <Image src='/images/post-prev-1.jpg' alt="" width={350} height={350}></Image>
            <PostHover />
        </Link>
    )
}