import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";

export const useOutsideAlerter = (
  refs: Array<MutableRefObject<any>>,
  setShowFunction: Dispatch<SetStateAction<any>>,
): void => {
  useEffect(() => {
    function handleClickOutside(event: any): void {
      let clicked = 0;
      for (const ref of refs) {
        if (ref.current?.contains(event.target)) {
          clicked++;
        }
      }

      // If we clicked outside any of the ref elements
      if (clicked === 0) {
        setShowFunction(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs]);
};
