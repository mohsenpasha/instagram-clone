import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export async function fetchLikePost(postId:string){
    const response = await fetch(`http://localhost:8000/like/${postId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}

export async function fetchUnlikePost(postId:string){
    const response = await fetch(`http://localhost:8000/unlike/${postId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}
export async function fetchGetPostLikeList(currentUrl:string){
    const response = await fetch(currentUrl, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}

