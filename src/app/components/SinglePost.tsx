import Image from "next/image";
import { IconComment, IconDirect, IconEmoji, IconHeart, IconMore, IconSave } from "./Icons";
import { useTranslation } from "next-i18next";
import test from "node:test";
import React, { useEffect, useRef, useState } from "react";
import { list } from "postcss";
import { Interface } from "readline";

export default function SinglePost(){
    const { t } = useTranslation();
    return(
        <div className="my-44 flex border-[1px] border-ss flex-wrap relative pb-12 md:pb-0">
            <div className="w-full md:w-7/12 mt-[70px] md:mt-0">
                <Image src='/images/post-1.jpg' alt="" width={1080} height={1080}></Image>
            </div>
            <div className="w-full md:w-5/12">
                <div className="flex items-center absolute md:static top-0 right-0 w-full">
                    <div className="flex h-[70px] md:h-auto items-center gap-2 px-[16px] py-[14px] w-full border-b-[1px] md:border-b-0 border-ss justify-between">
                        <div className="flex gap-2 w-11/12 sm:w-10/12 truncate">
                            <div className="rounded-full cursor-pointer size-8">
                                <Image className="rounded-full" src='/images/profile-img.jpeg' width={32} height={32} alt=""></Image>
                            </div>
                            <div className="w-9/12 sm:w-11/12 md:w-9/12">
                                <div>
                                    afshin_bizar
                                </div>
                                <div className="text-xs truncate">
                                    Dariu$h, Saeed Dehghan • Jadid FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFree$Tyle
                                </div>
                            </div>
                        </div>
                        <div>
                            <IconMore className="cursor-pointer"/>
                        </div>
                    </div>
                </div>
                <div className="px-2">
                    <PostAction />
                    <div className="mx-2 font-bold text-sm cursor-pointer">
                        <span>934</span> {t('likes')}
                    </div>
                    <div className="mx-2 text-xs cursor-pointer text-gray m-2">
                        1 day ago
                    </div>
                    <CommentInput />
                </div>
            </div>
        </div>
    )
}

export function PostAction(){
    const { t } = useTranslation();

    return(
        <div className="py-2 pt-[6px] flex justify-between w-full items-center">
            <div className="flex items-center">
                <span title={t('like')}>
                    <IconHeart className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                </span>
                <span title={t('comment')}>
                    <IconComment className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                    {/* <IconHeart className="text-red-700" active/> */}
                </span>
                <span title={t('share')}>
                    <IconDirect  className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                </span>
            </div>
            <div>
                <span title={t('save')}>
                    <IconSave className="cursor-pointer m-2 size-6 hover:text-zinc-500"/>
                </span>
            </div>
        </div>
    )
}
export function CommentInput(){
    const [value, setValue] = useState<string>("");
    const [emojiBottom,setEmojiBottom] = useState<boolean>(false)
    const [emojiBoxToggle,setEmojiBoxToggle] = useState<boolean>(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiBoxRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (emojiBoxRef.current && !emojiBoxRef.current.contains(e.target as Node)) {
            console.log('clicked outside')
            setEmojiBoxToggle(false);
        }
      };
    useEffect(() => {
        console.log('test')
        if (emojiBoxToggle) {
          document.addEventListener("click", handleClickOutside);
        } else {
          document.removeEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
      }, [emojiBoxToggle]);
    const handleInput = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        if(textareaRef.current){
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    };
    const test = (e : React.MouseEvent<HTMLDivElement>) => {
        const element = e.target as HTMLElement
        const rect = element.getBoundingClientRect();
        const distanceFromTop = rect.top;
        const distanceFromBottom = window.innerHeight - rect.bottom;
        
        if(distanceFromTop > distanceFromBottom) {
            setEmojiBottom(true)
        }
        else{
            setEmojiBottom(false)
        }
        setEmojiBoxToggle(!emojiBoxToggle)
    }
    const insertEmoji = (emoji: string) => {
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newValue =
            value.substring(0, start) + emoji + value.substring(end);
          setValue(newValue);

          setTimeout(() => {
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            textarea.focus();
          }, 0);
        }
      };
    const { t } = useTranslation()
    return(
        <div className="border-t-[1px] border-ss mx-2 py-[6px] items-center flex">
            <div className="relative cursor-pointer">
                <div onClick={test} className="py-2 px-4 inline-block"><IconEmoji/></div>
                {emojiBoxToggle && <EmojiBox insertEmoji={insertEmoji} emojiBoxRef={emojiBoxRef} isBottom0={emojiBottom}/>}
            </div>
            <textarea ref={textareaRef} className={`resize-none outline-none max-h-20 flex-1 text-sm items-center flex pr-1`} rows={1} onInput={handleInput} placeholder={t('add-comment')} value={value} name="" id=""></textarea>
            <span>Post</span>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
    )
}



export function EmojiBox({isBottom0,emojiBoxRef,insertEmoji} : {isBottom0? : boolean,emojiBoxRef : React.Ref<HTMLDivElement>,insertEmoji:(emoji: string) => void}) {
    
    const emojiList : {'name':string,'emoji':string[]}[] = [
        {
            "name":"Most popular",
            "emoji":["😂","😮","😍","😢","👏","🔥","🎉","💯","❤️","🤣","🥰","😘","😭","😊"]
        },
        {
            "name":"Activities",
            "emoji":["🕴","🧗","🧗‍♂️","🧗‍♀️","🏇","⛷","🏂","🏌","🏌️‍♂️","🏌️‍♀️","🏄","🏄‍♂️","🏄‍♀️","🚣","🚣‍♂️","🚣‍♀️","🏊","🏊‍♂️","🏊‍♀️","⛹","⛹️‍♂️","⛹️‍♀️","🏋","🏋️‍♂️","🏋️‍♀️","🚴","🚴‍♂️","🚴‍♀️","🚵","🚵‍♂️","🚵‍♀️","🤸","🤸‍♂️","🤸‍♀️","🤼","🤼‍♂️","🤼‍♀️","🤽","🤽‍♂️","🤽‍♀️","🤾","🤾‍♂️","🤾‍♀️","🤹","🤹‍♂️","🤹‍♀️","🧘","🧘‍♂️","🧘‍♀️","🎪","🛹","🎗","🎟","🎫","🎖","🏆","🏅","🥇","🥈","🥉","⚽","⚾","🥎","🏀","🏐","🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","⛳","⛸","🎣","🎽","🎿","🛷","🥌","🎯","🎱","🎮","🎰","🎲","🧩","♟","🎭","🎨","🧵","🧶","🎼","🎤","🎧","🎷","🎸","🎹","🎺","🎻","🥁","🎬","🏹",]
        },
        {
            "name":"Animals & Nature",
            "emoji":["🙈","🙉","🙊","💥","💫","💦","💨","🐵","🐒","🦍","🐶","🐕","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿","🦔","🦇","🐻","🐨","🐼","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊","🦅","🦆","🦢","🦉","🦚","🦜","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🐟","🐠","🐡","🦈","🐙","🐚","🐌","🦋","🐛","🐜","🐝","🐞","🦗","🕷","🕸","🦂","🦟","🦠","💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🌲","🌳","🌴","🌵","🌾","🌿","☘","🍀","🍁","🍂","🍃","🍄","🌰","🦀","🦞","🦐","🦑","🌍","🌎","🌏","🌐","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","☀","🌝","🌞","⭐","🌟","🌠","☁","⛅","⛈","🌤","🌥","🌦","🌧","🌨","🌩","🌪","🌫","🌬","🌈","☂","☔","⚡","❄","☃","⛄","☄","🔥","💧","🌊","🎄","✨","🎋","🎍",]
        },
        {
            "name":"Food & Drink",
            "emoji":["🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🥝","🍅","🥥","🥑","🍆","🥔","🥕","🌽","🌶","🥒","🥬","🥦","🍄","🥜","🌰","🍞","🥐","🥖","🥨","🥯","🥞","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥙","🍳","🥘","🍲","🥣","🥗","🍿","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🥢","🍽","🍴","🥄",]
        },
        {
            "name":"Objects",
            "emoji":["💌","🕳","💣","🛀","🛌","🔪","🏺","🗺","🧭","🧱","💈","🛢","🛎","🧳","⌛","⏳","⌚","⏰","⏱","⏲","🕰","🌡","⛱","🧨","🎈","🎉","🎊","🎎","🎏","🎐","🧧","🎀","🎁","🔮","🧿","🕹","🧸","🖼","🧵","🧶","🛍","📿","💎","📯","🎙","🎚","🎛","📻","📱","📲","☎","📞","📟","📠","🔋","🔌","💻","🖥","🖨","⌨","🖱","🖲","💽","💾","💿","📀","🧮","🎥","🎞","📽","📺","📷","📸","📹","📼","🔍","🔎","🕯","💡","🔦","🏮","📔","📕","📖","📗","📘","📙","📚","📓","📃","📜","📄","📰","🗞","📑","🔖","🏷","💰","💴","💵","💶","💷","💸","💳","🧾","✉","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","🗳","✏","✒","🖋","🖊","🖌","🖍","📝","📁","📂","🗂","📅","📆","🗒","🗓","📇","📈","📉","📊","📋","📌","📍","📎","🖇","📏","📐","✂","🗃","🗄","🗑","🔒","🔓","🔏","🔐","🔑","🗝","🔨","⛏","⚒","🛠","🗡","⚔","🔫","🛡","🔧","🔩","⚙","🗜","⚖","🔗","⛓","🧰","🧲","⚗","🧪","🧫","🧬","🔬","🔭","📡","💉","💊","🚪","🛏","🛋","🚽","🚿","🛁","🧴","🧷","🧹","🧺","🧻","🧼","🧽","🧯","🚬","⚰","⚱","🗿","🚰",]
        },
        {
            "name":"Smileys & People",
            "emoji":["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😤","😡","😠","🤬","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","💋","👋","🤚","🖐","✋","🖖","👌","✌","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍","💅","🤳","💪","🦵","🦶","👂","👃","🧠","🦷","🦴","👀","👁","👅","👄","👶","🧒","👦","👧","🧑","👱","👨","🧔","👨‍🦰","👨‍🦱","👨‍🦳","👨‍🦲","👩","👩‍🦰","👩‍🦱","👩‍🦳","👩‍🦲","👱‍♀️","👱‍♂️","🧓","👴","👵","🙍","🙍‍♂️","🙍‍♀️","🙎","🙎‍♂️","🙎‍♀️","🙅","🙅‍♂️","🙅‍♀️","🙆","🙆‍♂️","🙆‍♀️","💁","💁‍♂️","💁‍♀️","🙋","🙋‍♂️","🙋‍♀️","🙇","🙇‍♂️","🙇‍♀️","🤦","🤦‍♂️","🤦‍♀️","🤷","🤷‍♂️","🤷‍♀️","👨‍⚕️","👩‍⚕️","👨‍🎓","👩‍🎓","👨‍🏫","👩‍🏫","👨‍⚖️","👩‍⚖️","👨‍🌾","👩‍🌾","👨‍🍳","👩‍🍳","👨‍🔧","👩‍🔧","👨‍🏭","👩‍🏭","👨‍💼","👩‍💼","👨‍🔬","👩‍🔬","👨‍💻","👩‍💻","👨‍🎤","👩‍🎤","👨‍🎨","👩‍🎨","👨‍✈️","👩‍✈️","👨‍🚀","👩‍🚀","👨‍🚒","👩‍🚒","👮","👮‍♂️","👮‍♀️","🕵","🕵️‍♂️","🕵️‍♀️","💂","💂‍♂️","💂‍♀️","👷","👷‍♂️","👷‍♀️","🤴","👸","👳","👳‍♂️","👳‍♀️","👲","🧕","🤵","👰","🤰","🤱","👼","🎅","🤶","🦸","🦸‍♂️","🦸‍♀️","🦹","🦹‍♂️","🦹‍♀️","🧙","🧙‍♂️","🧙‍♀️","🧚","🧚‍♂️","🧚‍♀️","🧛","🧛‍♂️","🧛‍♀️","🧜","🧜‍♂️","🧜‍♀️","🧝","🧝‍♂️","🧝‍♀️","🧞","🧞‍♂️","🧞‍♀️","🧟","🧟‍♂️","🧟‍♀️","💆","💆‍♂️","💆‍♀️","💇","💇‍♂️","💇‍♀️","🚶","🚶‍♂️","🚶‍♀️","🏃","🏃‍♂️","🏃‍♀️","💃","🕺","🕴","👯","👯‍♂️","👯‍♀️","🧖","🧖‍♂️","🧖‍♀️","🧘","👭","👫","👬","💏","👨‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","💑","👨‍❤️‍👨","👩‍❤️‍👩","👪","👨‍👩‍👦","👨‍👩‍👧","👨‍👩‍👧‍👦","👨‍👩‍👦‍👦","👨‍👩‍👧‍👧","👨‍👨‍👦","👨‍👨‍👧","👨‍👨‍👧‍👦","👨‍👨‍👦‍👦","👨‍👨‍👧‍👧","👩‍👩‍👦","👩‍👩‍👧","👩‍👩‍👧‍👦","👩‍👩‍👦‍👦","👩‍👩‍👧‍👧","👨‍👦","👨‍👦‍👦","👨‍👧","👨‍👧‍👦","👨‍👧‍👧","👩‍👦","👩‍👦‍👦","👩‍👧","👩‍👧‍👦","👩‍👧‍👧","🗣","👤","👥","👣","🧳","🌂","☂","🧵","🧶","👓","🕶","🥽","🥼","👔","👕","👖","🧣","🧤","🧥","🧦","👗","👘","👙","👚","👛","👜","👝","🎒","👞","👟","🥾","🥿","👠","👡","👢","👑","👒","🎩","🎓","🧢","⛑","💄","💍","💼",]
        },
        {
            "name":"Symbols",
            "emoji":["💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🖤","💯","💢","💬","👁️‍🗨️","🗯","💭","💤","💮","♨","💈","🛑","🕛","🕧","🕐","🕜","🕑","🕝","🕒","🕞","🕓","🕟","🕔","🕠","🕕","🕡","🕖","🕢","🕗","🕣","🕘","🕤","🕙","🕥","🕚","🕦","🌀","♠","♥","♦","♣","🃏","🀄","🎴","🔇","🔈","🔉","🔊","📢","📣","📯","🔔","🔕","🎵","🎶","🏧","🚮","🚰","♿","🚹","🚺","🚻","🚼","🚾","⚠","🚸","⛔","🚫","🚳","🚭","🚯","🚱","🚷","🔞","☢","☣","⬆","↗","➡","↘","⬇","↙","⬅","↖","↕","↔","↩","↪","⤴","⤵","🔃","🔄","🔙","🔚","🔛","🔜","🔝","🛐","⚛","🕉","✡","☸","☯","✝","☦","☪","☮","🕎","🔯","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂","▶","⏩","◀","⏪","🔼","⏫","🔽","⏬","⏹","⏏","🎦","🔅","🔆","📶","📳","📴","✖","➕","➖","➗","♾","‼","⁉","❓","❔","❕","❗","♻","🔱","📛","🔰","⭕","✅","☑","✔","❌","❎","➰","➿","〽","✳","✴","❇","©","®","™","#️⃣","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔠","🔡","🔢","🔣","🔤","🅰","🆎","🅱","🆑","🆒","🆓","ℹ","🆔","Ⓜ","🆕","🆖","🅾","🆗","🅿","🆘","🆙","🆚","🈁","🈂","🈷","🈶","🈯","🉐","🈹","🈚","🈲","🉑","🈸","🈴","🈳","㊗","㊙","🈺","🈵","🔴","🔵","⚫","⚪","⬛","⬜","◼","◻","◾","◽","▪","▫","🔶","🔷","🔸","🔹","🔺","🔻","💠","🔳","🔲",]
        },
        {
            "name":"Travel & Places",
            "emoji":["🚣","🗾","🏔","⛰","🌋","🗻","🏕","🏖","🏜","🏝","🏞","🏟","🏛","🏗","🏘","🏚","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🕍","⛩","🕋","⛲","⛺","🌁","🌃","🏙","🌄","🌅","🌆","🌇","🌉","🎠","🎡","🎢","🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚚","🚛","🚜","🏎","🏍","🛵","🚲","🛴","🚏","🛤","⛽","🚨","🚥","🚦","🚧","⚓","⛵","🚤","🛳","⛴","🛥","🚢","✈","🛩","🛫","🛬","💺","🚁","🚟","🚠","🚡","🛰","🚀","🛸","🌠","🌌","⛱","🎆","🎇","🎑","💴","💵","💶","💷","🗿","🛂","🛃","🛄","🛅"]
        }
    ]
    
    return(
        <div ref={emojiBoxRef} className={`absolute w-[342] h-[325px] bg-white shadow-[0_4px_12px_rgba(0,0,0,.15)] p-2 overflow-y-scroll rounded-lg z-50 ${isBottom0 && 'bottom-10'}`}>
            {emojiList.map((category,index)=>{
                return(
                    <div key={index} className="mb-4">
                        <h2 className="text-sm text-gray font-semibold mb-2">{category.name}</h2>
                        <div className="flex flex-wrap">
                            {category.emoji.map((emoji, i) => (
                            <span onClick={()=>insertEmoji(emoji)} key={i} className="size-[44px] items-center justify-center flex text-[32px] hover:bg-zinc-200 cursor-pointer">{emoji}</span>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>        
    )
}