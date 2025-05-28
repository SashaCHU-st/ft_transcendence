import { useEffect } from "react";

export function useEnterKey(callback: () => void) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [callback]);
}
