import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";

import { ReactComponent as ArrowIcon } from "../../assets/arrow-up.svg";
import logo from "../../assets/logo.png";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { useNav } from "../../hooks/utils/nav";
import { useOutsideAlerter } from "../../hooks/utils/outside";
import { device } from "../../utils/breakpoints";
import ConnectButton from "../ConnectButton";
import Button, { InnerButtonProps } from "./Button";
import SearchTextbox from "./SearchTextbox";
import { ButtonLink } from "./Theme";

interface NavWrapperProps {
  hide: boolean;
}

type SearchButtonProps = InnerButtonProps & {
  showSearchBar: boolean;
  children: React.ReactNode;
};

const NavWrapper = styled.div<NavWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100vw;
  max-width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0%;
  backdrop-filter: blur(5px);
  background: ${(props) => props.theme.backgroundNav};
  z-index: 1001;
  transition-property: top;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 250ms;

  ${(props) => props.hide && "top: -160px;"}
`;

const StyledNav = styled.nav`
  height: 80px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
`;

const MenuBars = styled.div`
  display: none;
  margin-right: 5px;

  @media ${device.tabletL} {
    display: inline-flex;
  }
`;

const LogoLink = styled(ButtonLink)`
  display: flex;
  align-items: center;
  margin-left: 20px;

  @media ${device.tabletL} {
    margin-left: 10px;
  }

  @media ${device.tabletM} {
    margin-left: 5px;
  }
`;

const LogoImage = styled.img`
  height: 50px;
`;

const LogoText = styled.p`
  font-weight: 900;
  font-size: 35px;
  margin: 0 0 0 10px;
  padding: 0;
  background: linear-gradient(90.07deg, #2fb8d4 0.07%, #294bff 77.14%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  @media ${device.tabletS} {
    font-size: 24px;
  }

  @media ${device.mobileL} {
    display: none;
  }
`;

const BetaText = styled.p`
  font-weight: 900;
  font-size: 12px;
  margin: 0 0 8px 6px;
  padding: 0;
  background: linear-gradient(90.07deg, #2fb8d4 0.07%, #294bff 77.14%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  align-self: end;

  @media ${device.mobileL} {
    display: none;
  }
`;

const DesktopSearchTextbox = styled(SearchTextbox)`
  @media ${device.tabletL} {
    display: none;
  }
`;

const SearchIconContainer = styled.div`
  display: none;

  @media ${device.tabletL} {
    display: inline-flex;
    margin-right: 5px;
  }
`;

const SearchButton = styled(Button)<SearchButtonProps>`
  ${(props) =>
    props.showSearchBar &&
    `
        font-size: 16px;
        padding: 13px 42.5px;
        @media ${device.tabletM} {
          padding: 11px 28.5px;
        }
        @media ${device.mobileXS} {
          padding: 13px 18px;
        }
    `};
`;

const NavButtonsWrapper = styled.div`
  max-width: calc(100% - 60px);

  display: flex;
  flex-direction: row;
  justify-content: end;
  flex-wrap: nowrap;

  > * {
    min-width: 0;
  }

  > *:nth-child(1) {
    margin-right: 5px;
  }
`;

const CreateMemeButton = styled(ButtonLink)`
  margin-right: 20px;

  @media ${device.tabletL} {
    margin-right: 5px;
  }
`;

const DesktopMemeMessage = styled.span`
  @media ${device.tabletL} {
    display: none;
  }
`;

const MobileMemeMessage = styled.span`
  display: none;
  @media ${device.tabletL} {
    display: inline;
  }
`;

const MobileSearchBar = styled.div`
  display: none;

  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  z-index: 1001;
`;

export type NavProps = React.HTMLAttributes<HTMLDivElement> & {
  toggleSidebar: () => void;
  setShowSearchBar: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
};

function Nav({
  setShowSearchBar: parentSetShowSearchBar,
  toggleSidebar,
  showSidebar,
  ...props
}: NavProps): JSX.Element {
  const { pathname } = useLocation();

  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    setShowSearchBar(false);

    if (showSidebar) {
      toggleSidebar();
    }
  }, [pathname]);

  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const searchIconRef = useRef<HTMLDivElement | null>(null);
  const searchTextboxRef = useRef<HTMLInputElement | null>(null);
  const navWrapperRef = useRef<HTMLDivElement | null>(null);
  useOutsideAlerter([searchBarRef, searchIconRef], setShowSearchBar);
  const hide = useNav(navWrapperRef, showSidebar);

  useEffect(() => {
    if (showSearchBar) {
      searchTextboxRef.current?.focus();
    }

    parentSetShowSearchBar(showSearchBar);
  }, [showSearchBar]);

  useEffect(() => {
    if (hide) {
      setShowSearchBar(false);
      parentSetShowSearchBar(showSearchBar);
    }
  }, [hide]);

  // Create meme button closes the sidebar first if it's open
  // So we first assume we are going to stay on the same page
  let createMemeLink = pathname;
  // If the sidebar is not open, we need to navigate somewhere
  if (!showSidebar) {
    if (pathname.includes("meme/create/editor")) {
      // If on editor, go back to create
      createMemeLink = "/meme/create";
    } else if (pathname.includes("meme/create")) {
      // If on create, go home
      createMemeLink = "/";
    } else {
      // Anywhere else, go to create
      createMemeLink = "/meme/create";
    }
  }

  return (
    <NavWrapper hide={hide} {...props} ref={navWrapperRef}>
      <StyledNav>
        <LogoLink
          to="/"
          onClick={() => {
            if (showSidebar) {
              toggleSidebar();
            }
          }}>
          <LogoImage src={logo}></LogoImage>
          <LogoText>memester</LogoText>
          <BetaText>beta</BetaText>
        </LogoLink>

        <DesktopSearchTextbox />

        <NavButtonsWrapper>
          <ConnectButton />

          <CreateMemeButton
            to={createMemeLink}
            onClick={() => {
              if (showSidebar) {
                toggleSidebar();
              }
            }}>
            <Button variant={pathname.includes("meme/create") ? "colored" : "outlined"}>
              <DesktopMemeMessage>Create a meme!</DesktopMemeMessage>
              <MobileMemeMessage>
                <PlusIcon />
              </MobileMemeMessage>
            </Button>
          </CreateMemeButton>

          <SearchIconContainer ref={searchIconRef}>
            <SearchButton
              variant={showSearchBar ? "colored" : "outlined"}
              onClick={() => {
                setShowSearchBar(!showSearchBar);
              }}
              showSearchBar={showSearchBar}>
              {/* Make bigger on Windows or use icon */}
              {showSearchBar ? <ArrowIcon width="13" /> : <SearchIcon width="18" />}
            </SearchButton>
          </SearchIconContainer>

          <MenuBars>
            <Button
              variant={showSidebar ? "colored" : "outlined"}
              onClick={() => {
                toggleSidebar();
              }}>
              <FontAwesomeIcon width={"12.25px"} icon={showSidebar ? faXmark : faBars} />
            </Button>
          </MenuBars>
        </NavButtonsWrapper>
      </StyledNav>
      <MobileSearchBar ref={searchBarRef} style={showSearchBar ? { display: "flex" } : undefined}>
        <SearchTextbox ref={searchTextboxRef} />
      </MobileSearchBar>
    </NavWrapper>
  );
}

export default Nav;
