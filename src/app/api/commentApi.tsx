type sendCommentType = {
    replied_to?:string,
    postId:string,
    comment:string,
}
export async function fetchAddComment(commentData:sendCommentType){
    try {
        const response = await fetch("http://localhost:8000/comment/add/", {
            method: "POST",
            credentials:'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
        });

        return response
    } catch (error) {
        alert("مشکلی پیش آمد، دوباره تلاش کنید.");
    }
};