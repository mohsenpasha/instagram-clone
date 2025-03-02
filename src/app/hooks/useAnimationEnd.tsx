import { useEffect, useRef } from "react";

export function useAnimationEnd(callback: () => void) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleAnimationEnd = () => {
      callback();
    };

    element.addEventListener("animationend", handleAnimationEnd);

    return () => {
      element.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [callback]);

  return ref;
}
