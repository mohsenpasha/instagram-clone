export async function fetchSearchUserAndTag(searchType:string,searchValue){
    const response = await fetch(`http://localhost:8000/search/${searchType}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({'s':searchValue}),
    });
    return(response)
}