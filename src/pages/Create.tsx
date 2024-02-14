import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "react-use";
import styled from "styled-components";

import memebg from "../assets/memebg.png";
import Header from "../components/category/Header";
import FeaturedMemeTemplates from "../components/editor/FeaturedMemeTemplates";
import Footer from "../components/theme/Footer";
import { EditorWrapper, PaddedWrapper, PageWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";
import useMemeTemplateStore from "../state/template";
import { device } from "../utils/breakpoints";

const CreateMemeWrapper = styled(EditorWrapper)`
  height: calc(100% - 140px);
  background-image: url(${memebg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: fill;
  justify-content: center;
  align-items: center;

  @media ${device.tabletM} {
    background-size: cover;
  }
`;

const DropModal = styled(Box)`
  width: 90%;
  text-align: center;
  border-width: 2px;
  border-radius: 2px;
  border-color: gray;
  border-style: dashed;
  background-color: ${(props) => props.theme.backgroundModal};
  cursor: pointer;

  p {
    padding-top: 50px;
    padding-bottom: 50px;
  }
`;

function Create(): JSX.Element {
  useTitle(`Create a Meme ${SUBTITLE}`);
  const { setSource } = useMemeTemplateStore();
  const navigate = useNavigate();

  const { competitionId } = useParams();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length) {
      setSource(acceptedFiles[0]);
      if (competitionId) {
        navigate(`/meme/create/${competitionId}/editor`);
      } else {
        navigate("/meme/create/editor");
      }
    }
  }, [acceptedFiles]);

  const supertitle = competitionId ? `Submit meme to #competition/${competitionId}` : "Become a real memester";

  return (
    <PageWrapper>
      <Header supertitle={supertitle} title="Create a Meme" />
      <CreateMemeWrapper>
        <DropModal {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop an image or click here to use your own template</p>
        </DropModal>
      </CreateMemeWrapper>
      <FeaturedMemeTemplates competitionId={competitionId} />
      <PaddedWrapper>
        <Footer />
      </PaddedWrapper>

      <Helmet>
        <meta property="og:title" content="Create a meme on memester" />
        <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
      </Helmet>
    </PageWrapper>
  );
}

export default Create;
