import Link from "next/link";


export function stringToLink(text:string) {
    const regex = /(@[[\p{L}\d_]+|#[\p{L}\d_]+)/gu;
    const parts = text.split(regex);
    return parts.map((part, index) => {
        if (part.startsWith("@")) {
            const username = part.slice(1);
            return (
                <Link key={index} href={`/${username}`} className="text-bll">
                    {part}
                </Link>
            );
        } else if (part.startsWith("#")) {
            const hashtag = part.slice(1);
            return (
                <Link dir="ltr" key={index} href={`/tags/${hashtag}`} className="text-bll">
                    {part}
                </Link>
            );
        }
        return part;
    });
}

export function extractTags(text:string) {
    const hashtagPattern = /#([a-zA-Z0-9_]+)/g;
    const hashtags = [...text.matchAll(hashtagPattern)].map(match => match[1]);

    return hashtags ;
}