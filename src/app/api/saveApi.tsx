export async function fetchSavePost(postId:number){
    const response = await fetch(`http://localhost:8000/save/${postId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}

export async function fetchUnsavePost(postId:number){
    const response = await fetch(`http://localhost:8000/unsave/${postId}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}