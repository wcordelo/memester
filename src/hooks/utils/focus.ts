import { useEffect, useState } from "react";

export const useTabFocus = (): boolean => {
  const [tabHasFocus, setTabHasFocus] = useState(true);

  useEffect(() => {
    const handleFocus = (): void => {
      setTabHasFocus(true);
    };

    const handleBlur = (): void => {
      setTabHasFocus(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return tabHasFocus;
};
