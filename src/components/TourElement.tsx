import { StepType, TourProvider, useTour } from "@reactour/tour";
import { useEffect } from "react";
import { useLocation } from "react-router";

export interface TourElementProps {
  children: JSX.Element;
}

function TourManager(): JSX.Element {
  const { setSteps, setCurrentStep } = useTour();
  const location = useLocation();

  useEffect(() => {
    if (setSteps) {
      if (location.pathname.startsWith("/meme/create/editor/")) {
        setCurrentStep(0);
      } else if (location.pathname === "/") {
        setCurrentStep(1);
      }
    }
  }, [location, setSteps]);

  return <></>;
}

export function TourElement({ children }: TourElementProps): JSX.Element {
  const tourSteps: StepType[] = [
    {
      selector: ".collect-fee-textbox",
      content: <p style={{ color: "black" }}>You can now charge a fee associated with collecting a meme you create!</p>,
    },
    {
      selector: ".main-right-sidebar .meme-competitions-container",
      content: (
        <p style={{ color: "black" }}>
          Meme Competitions have come to memester! Use this sidebar to view competitions, enter them, and create your
          own competition!
        </p>
      ),
    },
  ];

  return (
    <TourProvider steps={tourSteps} showNavigation={false} showBadge={false}>
      <TourManager />
      {children}
    </TourProvider>
  );
}
