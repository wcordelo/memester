import { useEffect, useState } from "react";

type ScrollDirection = "down" | "up" | undefined;

type UseScrollDirection = [ScrollDirection, () => void];

export const useScrollDirection = (showSidebar: boolean): UseScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(undefined);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = (): void => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -5) && !showSidebar) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection, showSidebar]);

  const resetScrollDirection = (): void => {
    setScrollDirection(undefined);
  };

  return [scrollDirection, resetScrollDirection];
};

export const useScrollValue = (): number => {
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    const updateScrollDirection = (): void => {
      setScrollValue(window.pageYOffset);
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollValue]);

  return scrollValue;
};
