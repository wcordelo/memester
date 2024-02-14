import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router";
import { useTitle } from "react-use";
import styled from "styled-components";

import Footer from "../components/theme/Footer";
import { PaddedWrapper, PageWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";

const PaddedReactMarkdown = styled.div`
  width: 80%;
`;

function Policy(): JSX.Element {
  const { policy } = useParams();
  const navigate = useNavigate();

  const [policyMarkdown, setPolicyMarkdown] = useState<string | undefined>();
  const [title, setTitle] = useState<string>("Policy");

  useEffect(() => {
    if (policy) {
      const policyFile = new URL(`../assets/policies/${policy}.md`, import.meta.url).href;

      fetch(policyFile)
        .then(async (r) => await r.text())
        .then((text) => {
          if (text.startsWith("<!DOCTYPE html>")) {
            navigate("/no-policy-found");
          } else {
            setPolicyMarkdown(text);

            setTitle(
              policy
                .split("-")
                .map((word) => word[0].toUpperCase() + word.substring(1))
                .join(" "),
            );
          }
        })
        .catch(console.error);
    }
  }, [policy]);

  useTitle(`${title} ${SUBTITLE}`);

  return (
    <PageWrapper>
      <PaddedWrapper>
        {policyMarkdown ? (
          <PaddedReactMarkdown>
            <ReactMarkdown>{policyMarkdown}</ReactMarkdown>
          </PaddedReactMarkdown>
        ) : (
          <FontAwesomeIcon icon={faSpinner} spinPulse />
        )}
      </PaddedWrapper>
      <PaddedWrapper>
        <Footer />
      </PaddedWrapper>
      <Helmet>
        <meta property="og:title" content={`memester - ${title}`} />
        <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
      </Helmet>
    </PageWrapper>
  );
}

export default Policy;
