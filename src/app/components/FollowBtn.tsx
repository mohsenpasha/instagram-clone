import { useState } from "react";
import { IconFollow } from "./Icons"
import { useTranslation } from "next-i18next";

export function FollowBtn({haveIcon}:{haveIcon?:boolean}){
    const [isFollowing,setIsFollowing] = useState(true)
    let IconAvailable = true;
    if(haveIcon == false){
        IconAvailable = haveIcon
    }
    const { t } = useTranslation();
    return(
        <div className={`${isFollowing ? 'bg-gray hover:bg-grayer' : 'bg-bl hover:bg-bler text-white'} py-[7px] px-4 rounded-lg flex justify-center items-center gap-2 cursor-pointer font-semibold`}>
            {IconAvailable && !isFollowing &&
                <IconFollow className="size-[20px]"/>
            }
            {isFollowing ? 
                <span>{t('following')}</span>
                :
                <span>{t('follow')}</span>
            }
        </div>
    )
}