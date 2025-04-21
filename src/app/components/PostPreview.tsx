import Image from "next/image";
import Link from "next/link";
import PostHover from "./PostHover";
import { useDispatch } from "react-redux";
import { IconReels, IconView } from "./Icons";
import { changeUrl } from '@/store/slices/postSlice'

type postType = {
    isReel: boolean
    noIcon?:boolean
    postDetail:{id:string,preview_image:string,like_count:number,comment_count?:number,disable_comments?:boolean},
    isHoverPreview?:boolean,
    popupOpen?:boolean
}
export default function PostPreview({isReel,noIcon,postDetail,isHoverPreview=false,popupOpen=true}:postType){
    const dispatch = useDispatch();
    function clickHandle(event:React.MouseEvent){
        if(popupOpen){
            event.preventDefault()
            dispatch(changeUrl(`/p/${postDetail.id}`))
        }
    }
    return(
        <Link onClick={(event)=>clickHandle(event)} href={`/p/${postDetail.id}`} className={"group animate-Skeleton overflow-hidden relative " + (isHoverPreview ? 'w-[calc(33.33%-3px)] aspect-square' : (isReel ? "w-[calc(25%-3px)] aspect-[2/3]" : "w-[calc(33.33%-3px)] aspect-[3/4]"))}>
            {!noIcon && 
                <IconReels white className="absolute right-2 top-2"/>
            }
            <Image className="object-cover w-full h-full" src={postDetail.preview_image} alt="" width={350} height={350}></Image>
            {!noIcon &&
                <PostHover likeCount={postDetail.like_count} commentCount={postDetail.comment_count} isCommentDisable={postDetail.disable_comments} />
            }
            {isReel && 
                <div className="absolute bottom-4 left-4 size-[16px] text-white flex w-fit gap-1 items-center group-hover:opacity-0">
                    <IconView className="size-[16px]"/>
                    <span className="font-bold">192</span>
                </div>
            }
        </Link>
    )
}