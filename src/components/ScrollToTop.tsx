import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop(): JSX.Element {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  return <></>;
}

export default ScrollToTop;