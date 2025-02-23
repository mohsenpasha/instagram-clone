import { useState, useEffect } from "react";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches); // مقدار اولیه رو تنظیم می‌کنه

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener("change", listener); // تغییرات رو گوش می‌کنه

        return () => media.removeEventListener("change", listener); // پاک کردن لیسنر هنگام خروج
    }, [query]);

    return matches;
};

export default useMediaQuery;