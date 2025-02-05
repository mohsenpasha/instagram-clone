import PostPreview from "./PostPreview";

export default function PostList(){
    return(
        <div className="flex w-full mb-6 gap-[4px] flex-wrap">
            <PostPreview/> 
            <PostPreview/> 
            <PostPreview/> 
            <PostPreview/> 
            <PostPreview/> 
            <PostPreview/> 
            <PostPreview/> 
        </div>
    )
}