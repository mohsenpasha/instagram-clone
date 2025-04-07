import { RootState } from "@/store/store"
import { RefObject, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FollowBtn } from "./FollowBtn"
import Link from "next/link"
import Image from "next/image"
import { simplePost } from "@/api/simplePost"
import { seenMessages } from "@/store/slices/notificationSlice"

export default function NotificationBar({closeAnimationStat,ref}:{closeAnimationStat:boolean,ref?:RefObject<HTMLElement | null>}){
    const notificationInfo = useSelector((state: RootState) => state.notificationInfo.notificationList)
    const [groupedNotifications, setGroupedNotifications] = useState({
      new: [] as any[],
      today: [] as any[],
      yesterday: [] as any[],
      past: [] as any[]
    })
  
    const dispatch = useDispatch()
  
    useEffect(() => {
      simplePost("http://localhost:8000/readnotification/")
      dispatch(seenMessages())
    }, [])
  
    useEffect(() => {
      const newGroup: any = {
        new: [],
        today: [],
        yesterday: [],
        past: []
      }
  
      for (let item of notificationInfo) {
        const { t, t_ago } = item.timestamp
        if (t === "s" || t === "m" || (t === "h" && t_ago < 3)) {
          newGroup.new.push(item)
        } else if (t === "h" && t_ago >= 3) {
          newGroup.today.push(item)
        } else if (t === "d" && t_ago == 1) {
          newGroup.yesterday.push(item)
        } else {
          newGroup.past.push(item)
        }
      }
  
      setGroupedNotifications(newGroup)
    }, [notificationInfo])
  
    const renderNotification = (item: any, index: number) => {
      switch (item.type) {
        case "follow":
          return <FollowNotification user={item.sender} message={item.message} time={item.timestamp} key={index} />
        case "like":
          return <LikeNotification user={item.sender} message={item.message} post={item.post} time={item.timestamp} key={index} />
        case "comment":
          return <CommentNotification user={item.sender} comment={item.comment_text} post={item.post} time={item.timestamp} key={index} />
        default:
          return null
      }
    }
  
    const renderSection = (title: string, items: any[]) => {
      if (items.length === 0) return null
      return (
        <>
          <div className="px-6 mb-2 py-2 first:pt-0 first:border-0 border-t-[1px] border-ss">
            <span className="font-bold text-black text-base mb-4">{title}</span>
          </div>
          {items.map(renderNotification)}
        </>
      )
    }
  
    return (
      <div
        ref={ref}
        className={`absolute flex flex-col h-[100vh] top-0 left-[74px] bg-white rounded-2xl rounded-l-none rounded-bl-none w-96 z-50 py-2 shadow-[4px_0px_8px_rgba(0,0,0,.1)] ${
          closeAnimationStat ? "animate-maxWClose" : "animate-maxW"
        }`}
      >
        <div className="p-6 pt-4 text-2xl font-bold">Notifications</div>
        <div className="flex flex-col flex-1 text-gray text-sm font-medium overflow-auto">
          {renderSection("New", groupedNotifications.new)}
          {renderSection("Today", groupedNotifications.today)}
          {renderSection("Yesterday", groupedNotifications.yesterday)}
          {renderSection("Previous", groupedNotifications.past)}
        </div>
      </div>
    )
}

export function FollowNotification({user,message,time}:{user:{},message:string}){
    return(
        <Link href={'/' + user.username} className={`flex w-full h-[60px] items-center px-6 py-2 justify-between hover:bg-[#F5F5F5]`}>
            <div className="flex w-full gap-2 items-center">
                <div className={`size-11 rounded-full overflow-hidden flex-shrink-0 relative`}>
                    <Image className="rounded-full" src={user.profile_pic || '/images/profile-img.jpeg'} alt="" width={44} height={44}></Image>
                </div>
                <div className={`flex flex-col text-sm leading-[18px] relative`}>
                    <div className="text-black truncate inline-block w-fit" href="#">
                        <span className="font-semibold">{user.username} </span>
                        <span className="font-normal">started following you.</span>
                        <span className="ml-1 text-gray">{time.t_ago + time.t}</span>
                        </div>
                </div>
            </div>
            {/* <div className="cursor-pointer flex-shrink-0 over text-sm">
                <FollowBtn userData={{user,isLoading:false}} haveIcon={false}/>
            </div> */}
        </Link>
    )
}

export function LikeNotification({user,message,post,time}:{user:{},message:string}){
    return(
        <Link href={'/p/' + post.id} className={`flex w-full h-[60px] items-center px-6 py-2 justify-between hover:bg-[#F5F5F5]`}>
            <div className="flex w-full gap-2 items-center">
                <div className={`size-11 rounded-full overflow-hidden flex-shrink-0 relative`}>
                    <Image className="rounded-full" src={user.profile_pic || '/images/profile-img.jpeg'} alt="" width={44} height={44}></Image>
                </div>
                <div className={`flex flex-col text-sm leading-[18px] relative`}>
                    <div className="text-black truncate inline-block w-fit" href="#">
                        <span className="font-semibold">{user.username} </span>
                        <span className="font-normal">liked your post</span>
                        <span className="ml-1 text-gray">{time.t_ago + time.t}</span>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 size-11 overflow-hidden rounded-lg">
                <Image src={post.preview_image} width={44} height={44} alt=""></Image>
            </div>
        </Link>
    )
}

export function CommentNotification({user,comment,post,time}:{user:{},message:string}){
    return(
        <Link href={'/p/' + post.id} className={`flex w-full h-[60px] items-center px-6 py-2 justify-between hover:bg-[#F5F5F5]`}>
            <div className="flex w-full gap-2 items-center">
                <div className={`size-11 rounded-full overflow-hidden flex-shrink-0 relative`}>
                    <Image className="rounded-full" src={user.profile_pic || '/images/profile-img.jpeg'} alt="" width={44} height={44}></Image>
                </div>
                <div className={`flex flex-col text-sm leading-[18px] relative`}>
                    <div className="text-black inline-block w-fit" href="#">
                        <div className="font-normal inline-block">
                        <span className="font-semibold float-left mr-1">{user.username}</span>
                            <span>
                                commented: {comment}
                            </span>
                            <span className="ml-1 text-gray" dir="ltr">{time.t_ago != 0 && (time.t_ago + time.t)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 size-11 overflow-hidden rounded-lg">
                <Image src={post.preview_image} width={44} height={44} alt=""></Image>
            </div>
        </Link>
    )
}