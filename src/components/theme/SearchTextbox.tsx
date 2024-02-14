import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { useScrollDirection } from "../../hooks/utils/scroll";
import { useSearch } from "../../hooks/utils/search";
import { device } from "../../utils/breakpoints";
import Textbox, { TextboxButton, TextboxProps } from "./Textbox";
import { ButtonLink } from "./Theme";

export type SearchTextboxProps = TextboxProps;

interface ResultsProp {
  show: boolean;
}

const SearchWrapper = styled.div`
  position: relative;
  max-width: 800px;
  min-width: 0px;
  flex-grow: 0.8;

  @media ${device.tabletL} {
    max-width: unset;
    min-width: unset;
    flex-grow: unset;
    width: 99%;
  }
`;

const InnerSearchTextbox = styled(Textbox)`
  width: 100%;
  border-radius: 35px;
  border-color: ${(props) => props.theme.borderColor};

  @media ${device.tabletL} {
    width: 99%;
  }
`;

const Results = styled.div<ResultsProp>`
  display: none;
  width: 100%;
  position: absolute;
  top: 66px;
  z-index: 1001;

  backdrop-filter: blur(5px);
  background: ${(props) => props.theme.backgroundNav};
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;

  ${(props) => props.show && "display: block;"}

  ul {
    margin: 0;
    list-style: none;
    padding: 0;

    li {
      padding-bottom: 24px;
      padding-left: 22px;
    }
  }
`;

function SearchTextbox(
  { className, style, ...props }: SearchTextboxProps,
  ref: ForwardedRef<HTMLInputElement | null>,
): JSX.Element {
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const results = useSearch(query);

  const empty = (): void => {
    setQuery("");
    setShowResults(false);
  };

  useEffect(() => {
    if (results) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [results]);

  useClickAway(wrapperRef, () => {
    empty();
  });

  const [scrollDirection] = useScrollDirection(false);

  useEffect(() => {
    if (scrollDirection === "down") {
      empty();
    }
  }, [scrollDirection]);

  return (
    <SearchWrapper className={className} style={style} ref={wrapperRef}>
      <InnerSearchTextbox
        endAdornment={
          <TextboxButton position="end">
            <SearchIcon width="18" />
          </TextboxButton>
        }
        ref={ref}
        {...props}
        value={query}
        placeholder="Search"
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <Results show={showResults}>
        <ul>
          {results?.map((result) => {
            return result.URL ? (
              <ButtonLink
                key={result.text}
                to={result.URL}
                onClick={() => {
                  empty();
                }}>
                <li>{result.text}</li>
              </ButtonLink>
            ) : (
              <li>{result.text}</li>
            );
          })}
        </ul>
      </Results>
    </SearchWrapper>
  );
}

export default forwardRef(SearchTextbox);
