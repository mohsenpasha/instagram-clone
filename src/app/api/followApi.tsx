import { listToggleIsLoading } from "@/store/slices/postSlice";
import { toggleIsLoading } from "@/store/slices/userSlice";
export async function fetchFollowUser(username:string,dispatch:any,inList=true){
    if(inList){
        dispatch(listToggleIsLoading({username:username,result:true}))
    }
    else{
        dispatch(toggleIsLoading(true))
    }
    const response = await fetch(`http://localhost:8000/follow/${username}`, {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if(inList){
        dispatch(listToggleIsLoading({username:username,result:false}))
    }
    else{
        dispatch(toggleIsLoading(false))
    }
    return(response)
}

export async function fetchUnfollowUser(username:string,dispatch:any,inList=true){
    if(inList){
        dispatch(listToggleIsLoading({username:username,result:true}))
    }
    else{
        dispatch(toggleIsLoading(true))
    }
    const response = await fetch(`http://localhost:8000/unfollow/${username}`, {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if(inList){
        dispatch(listToggleIsLoading({username:username,result:false}))
    }
    else{
        dispatch(toggleIsLoading(false))
    }
    return(response)
}


