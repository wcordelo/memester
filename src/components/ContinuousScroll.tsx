import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

import useOnScreen from "../hooks/utils/view";

interface ContinuousScrollProps {
  enabled?: boolean;
  onView: () => void;
}

function ContinuousScroll({ enabled, onView }: ContinuousScrollProps): JSX.Element {
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);

  // TODO: if the item is already on screen and stays on screen, this isn't called again, it should be
  useEffect(() => {
    if (isOnScreen && enabled) {
      onView();
    }
  }, [isOnScreen]);

  return <div ref={elementRef}>{enabled && <FontAwesomeIcon icon={faSpinner} spinPulse />}</div>;
}

export default ContinuousScroll;
