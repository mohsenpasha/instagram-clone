import { IconArrow } from "./Icons";
import SinglePost from "./SinglePost";
import { useTranslation } from "next-i18next";

export function PostPopupSlider(){
    const { t } = useTranslation()
    
    return(
        <div className="fixed top-0 left-0 w-full h-full z-30 md:flex justify-center items-center bg-black bg-opacity-60 overflow-y-scroll">
            <div className="md:hidden h-11 z-20 flex items-center border-b-[1px] border-ss sticky top-0 bg-white">
                <span className="px-6 cursor-pointer">
                    <IconArrow className="-rotate-90 rtl:rotate-90"/>
                </span>
                <span className="font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{t('post')}</span>
            </div>
            <div className="md:flex w-full md:w-10/12 justify-center lg:w-[900px] relative z-30">
                <SinglePost isPopup={true}/>
            </div>
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between z-20 px-4">
                <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center -rotate-90 rtl:rotate-90 cursor-pointer">
                    <IconArrow className="size-4"/>
                </span>
                <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center rotate-90 rtl:-rotate-90 cursor-pointer">
                    <IconArrow className="size-4"/>
                </span>
            </div>
        </div>
    )
}