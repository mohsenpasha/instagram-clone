import { useEffect } from "react";

export function useClickOutside(
  refs: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[],
  callback: (event: MouseEvent) => void
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];

      if (refArray.every(ref => ref.current && !ref.current.contains(e.target as Node))) {
        callback(e);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [refs, callback]);
}