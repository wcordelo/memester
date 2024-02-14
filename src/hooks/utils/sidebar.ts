import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";

import { sizes } from "../../utils/breakpoints";
import { useScrollValue } from "./scroll";

export const useSidebar = (): any => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollValue = useScrollValue();
  const [previousScrollValue, setPreviousScrollValue] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  const { width } = useWindowSize();

  const toggleSidebar = (): void => {
    if (!showSidebar) {
      setPreviousScrollValue(scrollValue);
      scrollTo(0, 0);
      setTimeoutId(
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.display = "none";
          }
        }, 500),
      );
    } else {
      if (contentRef.current) {
        contentRef.current.style.display = "block";
      }
      scrollTo(0, previousScrollValue);
    }
    setShowSidebar(!showSidebar);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  // Close sidebar if window becomes bigger than when sidebar is shown
  useEffect(() => {
    if (width > sizes.tabletL) {
      setShowSidebar(false);
      if (contentRef.current) {
        contentRef.current.style.display = "block";
      }
    }
  }, [width]);

  return { contentRef, showSidebar, toggleSidebar, showSearchBar, setShowSearchBar };
};
