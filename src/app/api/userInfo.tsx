export async function fetchGetUserInfo(username:string){
    const response = await fetch(`http://localhost:8000/getuserinfo/${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return(response)
}
