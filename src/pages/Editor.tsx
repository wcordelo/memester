import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTour } from "@reactour/tour";
import html2canvas from "html2canvas";
import { Fragment, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useTitle } from "react-use";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";

import ColorPickerPopover from "../components/editor/ColorPickerPopover";
import ConfigPopover from "../components/editor/ConfigPopover";
import FeaturedMemeTemplates from "../components/editor/FeaturedMemeTemplates";
import MemeEditor from "../components/editor/MemeEditor";
import Button from "../components/theme/Button";
import Footer from "../components/theme/Footer";
import Sleepy from "../components/theme/Sleepy";
import Textbox from "../components/theme/Textbox";
import { EditorWrapper, PaddedWrapper, PageWrapper } from "../components/theme/Theme";
import { SUBTITLE, TOUR_COLLECT_SEEN } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useDefaultProfile } from "../hooks/api/profile";
import { useEnterCompetition } from "../hooks/combined/competitions/publish";
import { usePublishMeme } from "../hooks/combined/publish";
import {
  TemplateImage,
  TemplateText,
  TemplateTextParams,
  useTemplate,
  useTemplateBackground,
  useTemplateContent,
  useTemplateTexts,
} from "../hooks/utils/template";
import useMemeTemplateStore from "../state/template";
import { useLocalStorage } from "../store";
import { DefaultCategories } from "../types/categories";
import { convertBase64, getIdealFontSize, parseIPFSURL } from "../utils";
import { device } from "../utils/breakpoints";
import { html2CanvasOptions, Scale } from "../utils/resize";
import { toastError } from "../utils/toast";

function download(dataUrl: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "meme.png";
  link.click();
}

const MemeControlsWrapper = styled.div`
  width: calc(85% - 600px);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 25px;

  @media ${device.desktopS} {
    width: 90%;
    margin: 25px;
  }
`;

const TextboxTitle = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.lightTextColor};
  margin: 0 0 3px 3px;
`;

const RemoveTextButton = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.buttonColor};
`;

const AddElementButton = styled(Button)`
  width: 130px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
  font-weight: 800;
  margin-top: 4px;
  margin-left: 3px;
  margin-bottom: 15px;
  border-radius: 16px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const TagButton = styled(Button)`
  border-radius: 16px;
  margin: 3px;
  text-transform: capitalize;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${(props) => props.theme.borderColor};
  padding: 11px 10px;
`;

const ShareAdornment = styled.div`
  width: 140px;
  height: 49px;
  right: -1px;
  position: absolute;
  background: ${(props) => props.theme.backgroundButton};
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;

  @media ${device.mobileL} {
    width: 100px;
  }
`;

const ShareButton = styled(Button)`
  border-radius: 16px;
  margin: 3px;
  margin-top: 2px;
  text-transform: capitalize;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${(props) => props.theme.backgroundButton};
  padding: 8px 10px;
`;

const BottomButtonsContainer = styled.div`
  margin-top: auto;
  padding-top: 25px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ConfigAdornment = styled.div`
  width: 140px;
  height: 49px;
  right: -1px;
  position: absolute;
  background: ${(props) => props.theme.backgroundButton};
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;

  @media ${device.mobileL} {
    width: 100px;
  }
`;

const WaitingMessage = styled.div`
  margin-left: 12px;
  font-size: 14px;
  align-self: center;
  flex-grow: 1;
`;

const AddButtonContainer = styled.div`
  margin-left: 2px;
  display: flex;
`;

const InfoText = styled.p`
  font-size: 12px;
  margin-left: 5px;
  margin-top: 0px;
  padding-top: 0px;
  color: ${(props) => props.theme.lightTextColor};
`;

function Editor(): JSX.Element {
  const navigate = useNavigate();
  useTitle(`Create a Meme ${SUBTITLE}`);

  const [scale, setScale] = useState<Scale | undefined>();

  const { competitionId, templatePublicationId } = useParams();
  const [loadedTemplate, loadingTemplate, errorTemplate] = useTemplate(templatePublicationId, scale?.down);

  const { source, setSource } = useMemeTemplateStore();

  const initialSize = getIdealFontSize();

  const { setIsOpen: setTourOpen } = useTour();
  const [tourSeen, setTourSeen] = useLocalStorage(TOUR_COLLECT_SEEN, false);

  useEffect(() => {
    if (loadedTemplate) {
      setSource(loadedTemplate.background);
      setTitle(loadedTemplate.title);
      setTextLines(loadedTemplate.texts);
      if (!tourSeen) {
        setTimeout(() => {
          setTourOpen(true);
        }, 1000);
        setTourSeen(true);
      }
    }
  }, [loadedTemplate, tourSeen]);

  const initialText = {
    id: 0,
    color: "white",
    shadowColor: "black",
    top: 10,
    left: 5,
    width: 600,
    text: "TEXT",
    fontFamily: "Impact",
    fontSize: initialSize,
  };

  const initialImage = {
    id: 0,
    top: 5,
    left: 5,
    width: 100,
    height: 100,
  };

  const [textLines, setTextLines] = useState<TemplateText[]>(() => {
    if (!templatePublicationId) {
      return [
        {
          id: 0,
          color: "#ffffff",
          shadowColor: "#000000",
          top: 10,
          left: 0,
          width: 600,
          text: "TOP TEXT",
          fontFamily: "Impact",
          fontSize: initialSize,
        },
        {
          id: 1,
          color: "#ffffff",
          shadowColor: "#000000",
          top: 1000,
          left: 0,
          width: 600,
          text: "BOTTOM TEXT",
          fontFamily: "Impact",
          fontSize: initialSize,
        },
      ];
    }
    return [];
  });

  const [images, setImages] = useState<TemplateImage[]>([]);
  const inputFile = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState<string>("Made on memester");
  const [caption, setCaption] = useState<string | undefined>("Built on @memester-xyz.lens");
  const [share, setShare] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [amountChargeForCollect, setAmountChargeForCollect] = useState<number>(0);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isAuthenticated } = useAuth(address);
  // TODO: Support multiple profiles
  const { defaultProfile } = useDefaultProfile(address);

  const [textPararms, setTextParams] = useState<TemplateTextParams[]>([]);
  const texts = useTemplateTexts(textPararms, scale?.up);
  const sourceIPFSHash = useTemplateBackground(source, !!templatePublicationId);
  const template = useTemplateContent(title, texts, sourceIPFSHash, loadedTemplate?.backgroundHash);

  // TODO: Before allowing to publish, validate metadata: https://docs.lens.xyz/docs/validate-metadata

  const { publish, loading, error, publicationId, status } = usePublishMeme(
    address,
    defaultProfile?.id,
    title,
    caption,
    share,
    textLines.map((line) => line.text).join(" / "),
    selectedTags,
    template,
    amountChargeForCollect,
  );

  const {
    publish: publishCompetition,
    loading: loadingCompetition,
    error: errorCompetition,
    publicationId: publicationIdCompetition,
    status: statusCompetition,
  } = useEnterCompetition(
    address,
    defaultProfile?.id,
    title,
    caption,
    textLines.map((line) => line.text).join(" / "),
    selectedTags,
    template,
    competitionId,
  );

  useEffect(() => {
    toastError(error);
  }, [error]);

  useEffect(() => {
    toastError(errorCompetition);
  }, [errorCompetition]);

  useEffect(() => {
    if (publicationId) {
      toast.success("Meme posted successfully!");
      navigate(`/meme/${publicationId}`);
    }
  }, [publicationId]);

  useEffect(() => {
    if (publicationIdCompetition) {
      toast.success("Meme submitted to competition successfully!");
      navigate(`/meme/${publicationIdCompetition}`);
    }
  }, [publicationIdCompetition]);

  const setPropertyById = (id: number, key: keyof TemplateText, value: any): void => {
    const index = textLines.findIndex((l) => l.id === id);
    setTextLines([...textLines.slice(0, index), { ...textLines[id], [key]: value }, ...textLines.slice(index + 1)]);
  };

  return (
    <Fragment>
      <PageWrapper>
        {templatePublicationId && loadingTemplate ? (
          <EditorWrapper>
            <FontAwesomeIcon icon={faSpinner} spinPulse />
          </EditorWrapper>
        ) : errorTemplate ? (
          <EditorWrapper>
            <Sleepy title="No meme template found for this publication id!" />
          </EditorWrapper>
        ) : (
          source && (
            <EditorWrapper>
              <MemeEditor
                loading={loading}
                source={source}
                textLines={textLines}
                images={images}
                setTextParams={setTextParams}
                setScale={setScale}
              />
              <MemeControlsWrapper>
                <TextboxTitle>Title</TextboxTitle>
                <Textbox
                  style={{ marginBottom: "20px" }}
                  disabled={loading}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />

                <TextboxTitle>Caption</TextboxTitle>
                <Textbox
                  style={{ marginBottom: "20px" }}
                  disabled={loading}
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                  endAdornment={
                    competitionId ? undefined : (
                      <ShareAdornment>
                        <ShareButton
                          title="You can help spread the word about memester! If you enable this, we will add a link to memester at the end of your caption."
                          variant={share ? "normal" : "outlined"}
                          disabled={loading}
                          onClick={() => {
                            setShare(!share);
                          }}>
                          Share Memester
                        </ShareButton>
                      </ShareAdornment>
                    )
                  }
                />

                <TextboxTitle>Text</TextboxTitle>
                {textLines.map((i) => {
                  return (
                    <Textbox
                      placeholder={`Text #${i.id}`}
                      disabled={loading}
                      value={i.text}
                      key={i.id}
                      onChange={(e) => setPropertyById(i.id, "text", e.target.value)}
                      endAdornment={
                        <ConfigAdornment>
                          {/* TODO: Pickers should also be disabled if the textbox is disabled */}
                          <ColorPickerPopover
                            onChange={(color: string) => setPropertyById(i.id, "color", color)}
                            color={i.color}
                            disabled={loading}
                          />
                          <ColorPickerPopover
                            onChange={(color: string) => setPropertyById(i.id, "shadowColor", color)}
                            color={i.shadowColor}
                            disabled={loading}
                          />
                          <ConfigPopover
                            item={i}
                            onSizeChange={(fontSize) => setPropertyById(i.id, "fontSize", fontSize)}
                            onFontChange={(fontFamily) => setPropertyById(i.id, "fontFamily", fontFamily)}
                            disabled={loading}
                          />
                          {textLines.length > 1 && (
                            <RemoveTextButton
                              onClick={() => {
                                const textLinesWithRemoved = textLines
                                  .filter((line) => line.id !== i.id)
                                  .map((line, i) => {
                                    line.id = i;
                                    return line;
                                  });
                                if (!loading) {
                                  setTextLines(textLinesWithRemoved);
                                }
                              }}>
                              ✕
                            </RemoveTextButton>
                          )}
                        </ConfigAdornment>
                      }
                    />
                  );
                })}

                <AddButtonContainer>
                  <AddElementButton
                    variant="outlined"
                    disabled={loading}
                    onClick={() => {
                      setTextLines([...textLines, { ...initialText, id: textLines[textLines.length - 1].id + 1 }]);
                    }}>
                    + Add Text
                  </AddElementButton>

                  <AddElementButton
                    variant="outlined"
                    disabled={loading}
                    onClick={() => {
                      inputFile?.current?.click();
                    }}>
                    + Add Image
                  </AddElementButton>
                  <input
                    type="file"
                    id="file"
                    ref={inputFile}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      (async () => {
                        const base64 = await convertBase64(e?.target?.files?.[0]);
                        if (base64 !== undefined) {
                          setImages([...images, { ...initialImage, content: base64 }]);
                        }
                      })().catch(console.error);
                    }}
                  />
                </AddButtonContainer>

                <TextboxTitle>Collect Fee</TextboxTitle>

                <Textbox
                  className="collect-fee-textbox"
                  onChange={(evt) => setAmountChargeForCollect(parseFloat(evt.target.value) || 0)}
                  placeholder={`Amount to charge in MATIC`}
                  disabled={loading}
                />
                <InfoText>Note: memester is supported by a 5% commission on collect fees.</InfoText>

                <TextboxTitle>Tags</TextboxTitle>
                <TagContainer>
                  {DefaultCategories.map((category) => {
                    const tag = category.tag;
                    return (
                      <TagButton
                        variant={selectedTags.includes(tag) ? "normal" : "outlined"}
                        key={tag}
                        disabled={loading}
                        onClick={() => {
                          if (selectedTags.length > 7 && !selectedTags.includes(tag)) {
                            toast.error("You can only select at most 8 tags!");
                          } else {
                            setSelectedTags(
                              selectedTags.includes(tag)
                                ? selectedTags.filter((t) => t !== tag)
                                : [...selectedTags, tag],
                            );
                          }
                        }}>
                        {category.title}
                      </TagButton>
                    );
                  })}
                  {/* TODO: Add custom tag button */}
                  {/* Disallow special categories */}
                </TagContainer>

                <BottomButtonsContainer>
                  <Button
                    loading={loading || loadingCompetition}
                    disabled={
                      !address ||
                      (chain?.unsupported ?? true) ||
                      !isAuthenticated ||
                      !title ||
                      !template ||
                      !textLines.map((line) => line.text || defaultProfile?.id === undefined).join("") ||
                      loading ||
                      loadingCompetition
                    }
                    onClick={() => {
                      (async () => {
                        const memeElement = document.getElementById("memeCanvas");
                        if (memeElement && scale) {
                          const result = await html2canvas(memeElement, html2CanvasOptions(scale.up));
                          if (competitionId) {
                            result.toBlob(publishCompetition, "image/jpeg");
                          } else {
                            result.toBlob(publish, "image/jpeg");
                          }
                        }
                      })().catch(console.error);
                    }}>
                    {competitionId ? `Enter Competition` : `Post Meme`}
                  </Button>
                  {status ? (
                    <WaitingMessage>{status}</WaitingMessage>
                  ) : statusCompetition ? (
                    <WaitingMessage>{statusCompetition}</WaitingMessage>
                  ) : (
                    template === undefined && <WaitingMessage>Uploading background to IPFS...</WaitingMessage>
                  )}

                  <Button
                    variant="outlined"
                    onClick={() => {
                      (async () => {
                        const memeElement = document.getElementById("memeCanvas");
                        if (memeElement && scale) {
                          const result = await html2canvas(memeElement, html2CanvasOptions(scale.up));
                          download(result.toDataURL());
                        }
                      })().catch(console.error);
                    }}>
                    Download Meme
                  </Button>
                </BottomButtonsContainer>
              </MemeControlsWrapper>
            </EditorWrapper>
          )
        )}
        <FeaturedMemeTemplates />
        <PaddedWrapper>
          <Footer />
        </PaddedWrapper>
      </PageWrapper>

      {loadedTemplate && (
        <Helmet>
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:title" content={`Create a '${loadedTemplate.title}' meme on memester`} />
          <meta property="og:image" content={parseIPFSURL(loadedTemplate.backgroundHash)} />
        </Helmet>
      )}
    </Fragment>
  );
}

export default Editor;
