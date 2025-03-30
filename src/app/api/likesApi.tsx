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


export async function fetchlikeComment(commentId:string){
    const response = await fetch(`http://localhost:8000/comment/like/${commentId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}

export async function fetchUnlikeComment(commentId:string){
    const response = await fetch(`http://localhost:8000/comment/unlike/${commentId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}