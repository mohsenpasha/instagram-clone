export async function checkProtected(){
        const response = await fetch("http://localhost:8000/protected/", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return(response)
    }