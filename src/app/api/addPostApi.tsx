export async function fetchAddPost(postData:{}){
    try {
        const response = await fetch("http://localhost:8000/post/add/", {
            method: "POST",
            credentials:'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        return response
    } catch (error) {
        alert("مشکلی پیش آمد، دوباره تلاش کنید.");
    }
};