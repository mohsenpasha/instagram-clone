export async function fetchSavePost(postId:string){
    const response = await fetch(`http://localhost:8000/save/${postId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}

export async function fetchUnsavePost(postId:string){
    const response = await fetch(`http://localhost:8000/unsave/${postId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}