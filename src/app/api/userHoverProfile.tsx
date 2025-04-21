export async function fetchGetUserHoverInfo(username:string){
    const response = await fetch(`http://localhost:8000/getuserhoverinfo/${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}
