import { useTranslation } from "next-i18next";
import { IconDirect } from "./Icons";

export function MessageBtn({bg,haveIcon}:{bg?:'blue' | 'gray',haveIcon:boolean}){
    const { t } = useTranslation();
    let IconAvailable = true;
    if(haveIcon == false){
        IconAvailable = haveIcon
    }
    return(
        <div className={`${bg == 'gray' ? 'bg-gray hover:bg-grayer' : 'bg-bl text-white hover:bg-bler'} py-[7px] px-4 rounded-lg flex justify-center items-center gap-2 cursor-pointer font-semibold`}>
                    {IconAvailable &&
                        <IconDirect className="size-[20px]"/>
                    }
                    <span>{t('message')}</span>
                </div>
    )
}