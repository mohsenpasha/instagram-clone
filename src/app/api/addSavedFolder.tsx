export async function fetchAddSavedFolder(searchValue:{}){
    const response = await fetch(`http://localhost:8000/addsavedfolder/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(searchValue),
    });
    return(response)
}