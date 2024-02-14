import { MutableRefObject, useEffect, useState } from "react";
import { useLocation } from "react-use";

import { useOutsideAlerter } from "./outside";
import { useScrollDirection } from "./scroll";

export const useNav = (navWrapperRef: MutableRefObject<HTMLDivElement | null>, showSidebar: boolean): boolean => {
  const { pathname } = useLocation();

  const [hide, setHide] = useState(false);
  const [canHide, setCanHide] = useState(false);

  const [scrollDirection, resetScrollDirection] = useScrollDirection(showSidebar);

  useEffect(() => {
    if (pathname === "/") {
      setCanHide(true);
    } else {
      setCanHide(false);
    }
  }, [pathname]);

  useOutsideAlerter([navWrapperRef], () => {
    if (hide) {
      setHide(false);
      resetScrollDirection();
    }
  });

  useEffect(() => {
    if (scrollDirection === "down") {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [scrollDirection]);

  return hide && canHide;
};
