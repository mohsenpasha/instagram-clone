import { toggleIsLoading } from "@/store/slices/postSlice";

export async function fetchFollowUser(username:string,dispatch:any){
    console.log('test start point')
    console.log('test before dispatch')
    dispatch(toggleIsLoading({username:username,result:true}))
    console.log('test after dispatch')
    const response = await fetch(`http://localhost:8000/follow/${username}`, {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    dispatch(toggleIsLoading({username:username,result:false}))
    return(response)
}

export async function fetchUnfollowUser(username:string,dispatch:any){
    dispatch(toggleIsLoading({username:username,result:true}))
    const response = await fetch(`http://localhost:8000/unfollow/${username}`, {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    dispatch(toggleIsLoading({username:username,result:false}))
    return(response)
}


