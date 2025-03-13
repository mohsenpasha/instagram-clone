'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Login(){
    const [isInputActive,setIsInputActive] = useState([false,false])
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [isPasswordVisible,setIsPasswordVisible] = useState(false)
    const [activeImage,setActiveImage] = useState([true,false,false,false])
    useEffect(()=>{
        setIsInputActive(
            isInputActive.map((item,index)=>{
                return index == 0 ? (username.length == 0 ? false : true ) : (password.length == 0 ? false : true )
            })
        )
    },[username,password])
    useEffect(() => {
        const interval = setInterval(() => {
          setActiveImage((prevImages) => {
            let currentIndex = prevImages.findIndex((item) => item === true);
            if (currentIndex === 3) currentIndex = -1;
      
            return prevImages.map((_, index) => index === currentIndex + 1);
          });
        }, 6000);
      
        return () => clearInterval(interval); // جلوگیری از مشکلات حافظه
      }, []);
    return(
        <div className="w-[100vw] min-h-[100vh] bg-black flex flex-col justify-center items-center">
            <div className="flex items-center text-white">
                <div className="w-full xs:w-[350px] flex flex-col gap-2">
                    <div className="w-full xs:border-[1px] border-[#363636] flex flex-col items-center gap-2 justify-center py-4">
                        <Image alt="" className="invert mt-6" src='/images/instagram.svg' width={175} height={51}></Image>
                        <div className="w-9/12 text-xs flex flex-col gap-2">
                        <div className="font-medium text-[#A8A8A8] text-base text-center">
                            Sign up to see photos and videos from your friends.
                        </div>
                            <label className="w-full relative bg-[#121212] border-[1px] rounded-sm border-[#555555] h-9 p-2">
                                <span className={`absolute ${isInputActive[0] ? 'top-2 text-[9px]' : 'top-1/2 text-xs'} select-none transition-all -translate-y-1/2 text-[#a8a8a8]`}>Phone number, username, or email</span>
                                <input value={username} onInput={(event)=>setUsername(event.target.value)} className={`${isInputActive[0] ? 'mt-1' : 'mt-0'} w-full absolute top-1/2 -translate-y-1/2 bg-transparent outline-none border-none`} type="text" />
                            </label>
                            <label className="w-full relative bg-[#121212] border-[1px] rounded-sm border-[#555555] h-9 p-2">
                                <span className={`absolute ${isInputActive[1] ? 'top-2 text-[9px]' : 'top-1/2 text-xs'} select-none transition-all -translate-y-1/2 text-[#a8a8a8]`}>Password</span>
                                <input value={password} onInput={(event)=>setPassword(event.target.value)} className={`${isInputActive[1] ? 'mt-1' : 'mt-0'} w-full absolute top-1/2 -translate-y-1/2 bg-transparent outline-none border-none`} type={`${isPasswordVisible ? 'text' : 'password'}`} />
                                {
                                    isInputActive[1] &&
                                    <div onClick={()=>setIsPasswordVisible(!isPasswordVisible)} className="text-white absolute right-2 font-bold top-1/2 -translate-y-1/2 cursor-pointer">
                                        {
                                            isPasswordVisible ? 
                                                <span>Hide</span>
                                            :
                                                <span>Show</span>
                                        }
                                    </div>
                                }
                            </label>
                            <label className="w-full relative bg-[#121212] border-[1px] rounded-sm border-[#555555] h-9 p-2">
                                <span className={`absolute ${isInputActive[0] ? 'top-2 text-[9px]' : 'top-1/2 text-xs'} select-none transition-all -translate-y-1/2 text-[#a8a8a8]`}>Full Name</span>
                                <input value={username} onInput={(event)=>setUsername(event.target.value)} className={`${isInputActive[0] ? 'mt-1' : 'mt-0'} w-full absolute top-1/2 -translate-y-1/2 bg-transparent outline-none border-none`} type="text" />
                            </label>
                            <label className="w-full relative bg-[#121212] border-[1px] rounded-sm border-[#555555] h-9 p-2">
                                <span className={`absolute ${isInputActive[0] ? 'top-2 text-[9px]' : 'top-1/2 text-xs'} select-none transition-all -translate-y-1/2 text-[#a8a8a8]`}>Username</span>
                                <input value={username} onInput={(event)=>setUsername(event.target.value)} className={`${isInputActive[0] ? 'mt-1' : 'mt-0'} w-full absolute top-1/2 -translate-y-1/2 bg-transparent outline-none border-none`} type="text" />
                            </label>
                            <div className="text-center text-[#A8A8A8] flex flex-col gap-6">
                                <span>People who use our service may have uploaded your contact information to Instagram.</span>
                                <span>By signing up, you agree to our Terms. Learn how we collect, use and share your data in our Privacy Policy and how we use cookies and similar technology in our Cookies Policy.</span>
                            </div>
                            <button disabled className="w-full disabled:opacity-70 bg-bl text-white h-8 font-medium rounded-lg text-sm mt-2">Next</button>
                        </div>
                    </div>
                    <div className="w-full xs:border-[1px] border-[#363636] flex flex-col text-sm items-center justify-center py-4">
                        <span>
                        Have an account?
                        </span>
                        <Link className="text-bl font-medium" href='login'>Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}