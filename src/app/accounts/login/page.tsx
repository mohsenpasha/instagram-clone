'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z.object({
    username: z.string().min(3, "نام کاربری حداقل باید ۳ کاراکتر باشد"),
    password: z.string().min(8, "رمز عبور حداقل باید ۸ کاراکتر باشد"),
});

export default function Login() {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [activeImage, setActiveImage] = useState([true, false, false, false]);
    const [isInputActive,setIsInputActive] = useState([false,false])
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    useEffect(()=>{
            setIsInputActive(
                isInputActive.map((item,index)=>{
                    return index == 0 ? (username.length == 0 ? false : true ) : (password.length == 0 ? false : true )
                })
            )
        },[username,password])
    const {
        register,
        handleSubmit,
        formState: { errors, isValid ,},
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    
    const loginSubmit = async (data: any) => {
            try {
                const response = await fetch("http://localhost:8000/login/", {
                    method: "POST",
                    credentials:'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    router.push("/")
                } else {
                    alert(result.message || "خطا در ورود!");
                }
            } catch (error) {
                alert("مشکلی پیش آمد، دوباره تلاش کنید.");
            }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImage((prevImages) => {
                let currentIndex = prevImages.findIndex((item) => item === true);
                if (currentIndex === 3) currentIndex = -1;
                return prevImages.map((_, index) => index === currentIndex + 1);
            });
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-[100vw] min-h-[100vh] bg-black flex flex-col justify-center items-center">
            <div className="flex items-center text-white w-full xs:w-auto">
                <div className="mdl:block hidden w-[465px] h-[635px] relative">
                    <Image alt="" src='/images/home-phones.png' width={465} height={635} />
                    <div className="absolute w-[250px] h-[538px] top-6 right-[60px]">
                        {activeImage.map((item, index) => (
                            <Image key={index} className={`absolute transition-all duration-[2000ms] ${item ? 'opacity-1' : 'opacity-0'}`} alt="" src={`/images/screenshot${index + 1}.png`} width={250} height={541} />
                        ))}
                    </div>
                </div>
                <div className="w-full xs:w-[350px] flex flex-col gap-2">
                    <div className="w-full xs:border-[1px] border-[#363636] flex flex-col items-center gap-2 justify-center py-4">
                        <Image alt="" className="invert my-6" src='/images/instagram.svg' width={175} height={51} />
                        
                        <form onSubmit={handleSubmit(loginSubmit)} className="w-9/12 text-xs flex flex-col gap-2">
                            <label className="w-full relative bg-[#121212] border-[1px] rounded-sm border-[#555555] h-9 p-2">
                                <span className={`${isInputActive[0] ? 'top-2 text-[9px]' : 'top-1/2 text-xs'} absolute text-[9px] -translate-y-1/2 select-none transition-all text-[#a8a8a8]`}>Phone number, username, or email</span>
                                
                                <input {...register("username")} onInput={(event)=>setUsername(event.target.value)} className={`${isInputActive[0] ? 'mt-1' : 'mt-0'} w-full absolute top-1/2 -translate-y-1/2 bg-transparent outline-none border-none`} type="text" />
                            </label>
                            <label className="w-full relative bg-[#121212] border-[1px] rounded-sm border-[#555555] h-9 p-2">
                                <span className={`${isInputActive[1] ? 'top-2 text-[9px]' : 'top-1/2 text-xs'} absolute text-[9px] -translate-y-1/2 select-none transition-all text-[#a8a8a8]`}>Password</span>
                                <input {...register("password")} onInput={(event)=>setPassword(event.target.value)} className={`${isInputActive[1] ? 'mt-1' : 'mt-0'} w-full absolute top-1/2 -translate-y-1/2 bg-transparent outline-none border-none`} type={isPasswordVisible ? 'text' : 'password'} />
                                {
                                    isInputActive[1] &&     
                                    <div onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="text-white absolute right-2 font-bold top-1/2 -translate-y-1/2 cursor-pointer">
                                        {isPasswordVisible ? <span>Hide</span> : <span>Show</span>}
                                    </div>
                                }
                            </label>
                            <button disabled={!isValid} type="submit" className="w-full bg-bl disabled:opacity-70 text-white h-8 font-medium rounded-lg text-sm mt-2">Log in</button>
                        </form>

                        <Link className="text-sm my-4" href='#'>Forgot password?</Link>
                    </div>
                    <div className="w-full xs:border-[1px] border-[#363636] flex text-sm items-center gap-1 justify-center py-4">
                        <span>Don't have an account?</span>
                        <Link className="text-bl font-medium" href='signup'>Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}