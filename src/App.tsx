import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import ScrollToTop from "./components/ScrollToTop";
import Nav from "./components/theme/Nav";
import SlideoutSidebar from "./components/theme/SlideoutSidebar";
import { DarkTheme, LightTheme } from "./components/theme/Theme";
import { TourElement } from "./components/TourElement";
import { useSidebar } from "./hooks/utils/sidebar";
import Category from "./pages/Category";
import Competition from "./pages/Competition";
import CompetitionList from "./pages/CompetitionList";
import Create from "./pages/Create";
import CreateCompetition from "./pages/CreateCompetition";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Policy from "./pages/Policy";
import Profile from "./pages/Profile";
import Publication from "./pages/Publication";
import useThemeModeStore from "./state/theme";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.textColor};
  }

  svg:not(.no-fill):not(.no-fill-inverse) {
    path {
      fill: ${(props) => props.theme.svgPathFillColor};
    }
  }

  svg.no-fill {
    path {
      stroke: ${(props) => props.theme.svgPathFillColor};
    }
  }

  svg.no-fill-inverse {
    path {
      stroke: ${(props) => props.theme.svgPathInverseFillColor};
    }
  }
  
`;

export function App(): JSX.Element {
  const { contentRef, showSidebar, toggleSidebar, showSearchBar, setShowSearchBar } = useSidebar();

  const { mode } = useThemeModeStore();
  const themeMode = mode === "light" ? LightTheme : DarkTheme;

  return (
    <Fragment>
      <Router>
        <ThemeProvider theme={themeMode}>
          <GlobalStyles />
          <ScrollToTop />
          <TourElement>
            <>
              <Nav toggleSidebar={toggleSidebar} setShowSearchBar={setShowSearchBar} showSidebar={showSidebar} />
              <SlideoutSidebar showSidebar={showSidebar} showSearchBar={showSearchBar} />
              <div ref={contentRef}>
                <Routes>
                  <Route path="*" element={<NotFound />} />
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/category/:category" element={<Category />}></Route>
                  <Route path="/meme/create" element={<Create />}></Route>
                  <Route path="/meme/create/editor" element={<Editor />}></Route>
                  <Route path="/meme/create/editor/:templatePublicationId" element={<Editor />}></Route>
                  <Route path="/meme/create/:competitionId" element={<Create />}></Route>
                  <Route path="/meme/create/:competitionId/editor" element={<Editor />}></Route>
                  <Route path="/meme/create/:competitionId/editor/:templatePublicationId" element={<Editor />}></Route>
                  <Route path="/meme/:publicationId" element={<Publication />}></Route>
                  <Route path="/user/:handle" element={<Profile />}></Route>
                  <Route path="/policy/:policy" element={<Policy />}></Route>
                  <Route path="/competition/create" element={<CreateCompetition />}></Route>
                  <Route path="/competition/list" element={<CompetitionList />}></Route>
                  <Route path="/competition/:competitionId" element={<Competition />}></Route>
                </Routes>
              </div>
            </>
          </TourElement>
        </ThemeProvider>
      </Router>
    </Fragment>
  );
}
