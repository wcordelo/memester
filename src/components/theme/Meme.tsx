import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useFullscreen, useToggle } from "react-use";
import styled from "styled-components";
import { useAccount } from "wagmi";

import notfound from "../../assets/404.png";
import { ReactComponent as CollectIcon } from "../../assets/collect.svg";
import collectFilledIcon from "../../assets/collect_filled.png";
import { ReactComponent as CommentIcon } from "../../assets/comment.svg";
import { blacklist, nsfw } from "../../assets/content.json";
import { ReactComponent as MirrorIcon } from "../../assets/mirror.svg";
import mirrorFilledIcon from "../../assets/mirror_filled.png";
import { ReactComponent as ShareIcon } from "../../assets/share.svg";
import { ReactComponent as TwistIcon } from "../../assets/twist.svg";
import { CompetitionType } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useDefaultProfile } from "../../hooks/api/profile";
import { useCollectPublication } from "../../hooks/combined/collect";
import { useMirrorPublication } from "../../hooks/combined/mirror";
import { PublicationId, useCompetitionPickWinner } from "../../hooks/contract/competitions/competition";
import useCompetitionWinnersStore from "../../state/compwinners";
import { Post } from "../../types/lens";
import { parseIPFSURL } from "../../utils";
import { device } from "../../utils/breakpoints";
import CollectModal from "../modal/CollectModal";
import Button from "./Button";
import { ButtonLink } from "./Theme";

const MemeWrapper = styled.div`
  width: calc(100% - 60px);
  background: ${(props) => props.theme.backgroundWrapper};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  border-radius: 32px;
  padding: 30px;
  margin-bottom: 25px;

  @media ${device.tabletL} {
    width: calc(100% - 30px);
    max-height: unset;
    padding: 15px;
  }
`;

const PostDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  p {
    margin-top: 0;
    display: inline;
    a {
      display: inline;
    }
  }

  p:nth-child(1) {
    font-weight: 900;
    font-size: 14px;
    margin-right: 5px;
    max-width: 60%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    a {
      display: inline;
      margin-left: 5px;
    }

    @media ${device.tabletM} {
      max-width: 50%;
    }

    @media ${device.mobileL} {
      max-width: 40%;
    }

    @media ${device.mobileS} {
      max-width: 30%;
    }
  }

  p:not(:nth-child(1)) {
    margin-left: 5px;
    margin-right: 5px;
    color: ${(props) => props.theme.lightTextColor};
    font-size: 12px;
  }
`;

const PostTitle = styled.p`
  font-weight: 900;
  font-size: 24px;
  line-height: 40px;
  margin: 0;
  margin-bottom: 12px;
`;

const WinnerTag = styled.span`
  font-weight: 900;
  font-size: 24px;
  line-height: 40px;
  margin: 0;
  margin-bottom: 12px;
  background: linear-gradient(90.07deg, #2fb8d4 0.07%, #294bff 77.14%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 6px;
  position: relative;

  @media ${device.tabletL} {
    flex-direction: column;
    max-height: unset;
  }
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;

  @media ${device.tabletL} {
    flex-direction: row;
    justify-content: space-evenly;
    padding-left: 0;
  }
`;

const MemeImage = styled.img`
  min-width: 0px;
  object-fit: contain;
  background: none;
  border-radius: 5px;
  flex-grow: 1;

  @media ${device.tabletL} {
    max-width: 100%;
  }
`;

const WarningButton = styled(Button)`
  text-align: center;
  position: absolute;
  top: 50%;
  left: calc(50% - 54px);
  transform: translate(-50%, -50%);
  z-index: 999;
`;

const Caption = styled.p`
  white-space: pre-wrap;
`;

export interface ActionButtonProps {
  disabled?: boolean;
  checked?: boolean;
}

const ActionButton = styled.div<ActionButtonProps>`
  border: 1.5px solid ${(props) => props.theme.lightBorderColor};
  border-radius: 12px;
  width: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  &:not(:first-of-type) {
    margin-top: 5px;
  }
  margin-bottom: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  background-color: ${(props) => (props.checked ? "rgba(41, 150, 255, 0.25)" : "transparent")};
  transition: background-color 0.1s ease-in-out;

  img {
    margin-top: 3px;
    margin-bottom: 3px;
  }

  div {
    margin-top: 3px;
    margin-bottom: 3px;
  }

  p {
    font-weight: 900;
    font-size: 12px;
    line-height: 12px;

    /* identical to box height, or 100% */

    color: ${(props) => props.theme.lightTextColor};
    margin: 5px 0px;
  }

  @media ${device.tabletL} {
    margin: 3px;
  }
`;

interface ActionButtonCountProps {
  actioned?: boolean;
}

const ActionButtonCount = styled.p<ActionButtonCountProps>`
  ${(props) =>
    props.actioned &&
    `
      font-weight: 900;
      background: linear-gradient(90.07deg, #2fb8d4 0.07%, #294bff 77.14%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      margin: 0 0 10px 0;
  `};
`;

export interface MirrorDetails {
  handle: string;
  id: string;
}

export interface MemeProps {
  title: string;
  user: string;
  tags?: string[] | null;
  timestamp: string;
  image?: string;
  caption?: string;
  numberOfComments: number;
  numberOfMirrors: number;
  numberOfCollects: number;
  hasCollectedByMe?: boolean;
  mirroredId?: string;
  post?: Post;
  id: string;
  competitionId?: string;
  competitionType?: CompetitionType;
  isJudge?: boolean;
  winners?: PublicationId[];
  onCompleted: () => void;
  className?: string;
  style?: CSSProperties | undefined;
}

function Meme({
  title,
  tags,
  user,
  timestamp,
  image,
  caption,
  numberOfComments,
  numberOfMirrors,
  numberOfCollects,
  hasCollectedByMe,
  mirroredId,
  post,
  id,
  competitionId,
  competitionType,
  isJudge,
  winners,
  onCompleted,
  className,
  style,
}: MemeProps): JSX.Element {
  const { address } = useAccount();
  const { isAuthenticated } = useAuth(address);
  const { defaultProfile } = useDefaultProfile(address);
  const [parsedCaption, setParsedCaption] = useState<string | undefined>();
  const [competitionIdFromAttribute, setCompetitionIdFromAttribute] = useState<string | undefined>();
  const [collectModuleDialogRequired, setCollectModuleDialogRequired] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { competitionWinners, setCompetitionWinners } = useCompetitionWinnersStore();

  const imageRef = useRef(null);
  const [show, toggle] = useToggle(false);
  useFullscreen(imageRef, show, { onClose: () => toggle(false) });

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // TODO: Handle collect error
  const { collect, loading: collectLoading } = useCollectPublication(id, () => {
    onCompleted();
    setModalIsOpen(false);
  });
  const { mirror, loading: mirrorLoading } = useMirrorPublication(defaultProfile?.id, id, onCompleted);
  const { write: pickWinner, isLoading: pickWinnerLoading } = useCompetitionPickWinner(
    competitionId,
    [id],
    winners !== undefined && winners.length > 0,
  );

  const [mirrorDetails, setMirrorDetails] = useState<MirrorDetails | undefined>();
  useEffect(() => {
    if (post?.mirrorOf) {
      setMirrorDetails({ handle: post.mirrorOf.profile.handle, id: post.mirrorOf.id });
    }

    if (post?.collectModule.type !== "FreeCollectModule") {
      setCollectModuleDialogRequired(true);
    }

    const competitonIdFromAttribute = post?.metadata.attributes.filter((attr) => attr.traitType === "Competition")[0]
      ?.value;

    if (competitonIdFromAttribute && !competitionId) {
      setCompetitionIdFromAttribute(competitonIdFromAttribute);
    }
  }, [post]);

  const [showNsfw, setShowNsfw] = useState(false);

  useEffect(() => {
    if (caption) {
      let captionWithoutShare = caption.replace(
        /\n\nMake your own '.+' meme at https:\/\/(testnet.)?memester.xyz\/meme\/create\/editor\/0x[0-9a-fA-F]+-0x[0-9a-fA-F]+/gm,
        "",
      );

      if (captionWithoutShare.includes("Submit your own meme to the competition at ")) {
        captionWithoutShare = captionWithoutShare.replace(
          /\n\nSubmit your own meme to the competition at https:\/\/(testnet.)?memester.xyz\/competition\/[0-9]+/gm,
          "",
        );
      }

      setParsedCaption(captionWithoutShare);
    }
  }, [caption]);

  // blacklisted posts do not return an image or ways to interact
  if (blacklist.includes(id)) {
    return <p>This meme contained illegal content, as such it cannot be viewed using our website.</p>;
  }

  const [isWinner, setIsWinner] = useState(false);

  const winButtonMultipleWinnersClicked = (): void => {
    setIsWinButtonChecked(!isWinButtonChecked);
    if (competitionWinners.includes(id)) {
      setCompetitionWinners(competitionWinners.filter((winner) => winner !== id));
    } else {
      setCompetitionWinners([...competitionWinners, id]);
    }
  };

  const [isWinButtonChecked, setIsWinButtonChecked] = useState(false);

  useEffect(() => {
    if (winners && winners.length > 0) {
      const matchingWinner = winners.find(
        (winner) => `${winner.profileId.toHexString()}-${winner.pubId.toHexString()}` === id,
      );
      if (matchingWinner) {
        setIsWinner(true);
      }
    }
  }, [winners]);
  return (
    <MemeWrapper className={className} style={{ ...style, order: isWinner ? "-1" : "unset" }}>
      <ButtonLink to={`/meme/${id}`}>
        <PostTitle>
          {title}{" "}
          {isWinner && (
            <>
              <span> - </span>
              <WinnerTag>Winner</WinnerTag>
            </>
          )}
        </PostTitle>
      </ButtonLink>

      <PostDetails>
        <p
          title={
            tags && tags.length > 0
              ? tags
                  .filter((tag) => tag !== "meme")
                  .map((tag) => `#${tag}`)
                  .join(" ")
              : ""
          }>
          {tags && tags.length > 0 ? (
            <>
              {tags
                .filter((tag) => tag !== "meme")
                .map((tag) => {
                  return (
                    <ButtonLink to={`/category/${tag}`} key={tag}>
                      #{tag}
                    </ButtonLink>
                  );
                })}
            </>
          ) : (
            <>/no category</>
          )}

          {competitionIdFromAttribute && (
            <ButtonLink to={`/competition/${competitionIdFromAttribute}`}>
              #competition/{competitionIdFromAttribute}
            </ButtonLink>
          )}
        </p>
        <p>
          <ButtonLink to={`/user/${user}`}>@{user}</ButtonLink>&nbsp;
          {mirrorDetails && (
            <>
              mirrored <ButtonLink to={`/meme/${mirrorDetails.id}`}>@{mirrorDetails.handle}'s meme</ButtonLink>
            </>
          )}
        </p>

        <p>
          <ButtonLink to={`/meme/${id}`} title={timestamp}>
            {moment(timestamp).fromNow()}
          </ButtonLink>
        </p>
      </PostDetails>
      <ImageWrapper>
        {nsfw.includes(id) && !showNsfw && (
          <WarningButton variant="colored" onClick={() => setShowNsfw(true)}>
            NSFW meme. Click to view.
          </WarningButton>
        )}

        <MemeImage
          ref={imageRef}
          onClick={() => {
            if (pathname.includes("/meme/")) {
              toggle();
            } else {
              navigate(`/meme/${id}`);
            }
          }}
          style={nsfw.includes(id) && !showNsfw ? { filter: "blur(25px)", margin: "20px" } : {}}
          src={`${parseIPFSURL(image) ?? notfound}`}
        />

        <ActionButtonsWrapper>
          {/* TODO: Integrate reactions */}
          {/* <ActionButton>
            <img src={upvote}></img>
            <p>941</p>
            <img src={downvote}></img>
          </ActionButton> */}
          <ActionButton
            title="Comment"
            onClick={() => {
              navigate(`/meme/${id}`);
            }}>
            <CommentIcon />
            <p>{numberOfComments}</p>
          </ActionButton>
          <ActionButton
            title="Mirror"
            onClick={() => {
              if (mirroredId) {
                navigate(`/meme/${mirroredId}`);
              } else {
                isAuthenticated && mirror();
              }
            }}>
            {mirrorLoading ? (
              <div style={{ height: "27px" }}>
                <FontAwesomeIcon icon={faSpinner} style={{ height: "18px" }} spinPulse />
              </div>
            ) : mirroredId ? (
              <img src={mirrorFilledIcon}></img>
            ) : (
              <MirrorIcon />
            )}
            <ActionButtonCount actioned={!!mirroredId}>{numberOfMirrors}</ActionButtonCount>
          </ActionButton>
          <ActionButton
            title="Collect"
            onClick={() => {
              if (!hasCollectedByMe && isAuthenticated) {
                if (collectModuleDialogRequired) {
                  setModalIsOpen(true);
                } else {
                  collect();
                }
              }
            }}>
            {collectLoading ? (
              <div style={{ height: "19px" }}>
                <FontAwesomeIcon icon={faSpinner} style={{ height: "18px" }} spinPulse />
              </div>
            ) : hasCollectedByMe ? (
              <img src={collectFilledIcon}></img>
            ) : (
              <CollectIcon />
            )}
            <ActionButtonCount actioned={hasCollectedByMe}>{numberOfCollects}</ActionButtonCount>
          </ActionButton>
          <ActionButton
            title="Twist"
            onClick={() => {
              navigate(`/meme/create/editor/${id}`);
            }}>
            <TwistIcon />
          </ActionButton>
          <ActionButton
            title="Share"
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=Check%20out%20this%20meme%20on%20%40memester_xyz%0A%0A${encodeURIComponent(
                  `${window.location.protocol}//${window.location.host}/meme/${id}`,
                )}`,
                "popUpWindow",
                "height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes",
              );
            }}>
            <ShareIcon />
          </ActionButton>

          {competitionId && isJudge && (
            <ActionButton
              disabled={(pickWinnerLoading !== undefined && pickWinnerLoading) || (winners && winners?.length > 0)}
              title="Pick winner"
              checked={isWinButtonChecked}
              onClick={() => {
                if (competitionType === CompetitionType.JudgeCompeition) {
                  pickWinner?.();
                }
                if (competitionType === CompetitionType.JudgeCompetionMultipleWinners) {
                  winButtonMultipleWinnersClicked();
                }
              }}>
              {pickWinnerLoading ? (
                <div style={{ height: "19px" }}>
                  <FontAwesomeIcon icon={faSpinner} style={{ height: "18px" }} spinPulse />
                </div>
              ) : (
                // TODO: Add some icon
                "Pick Winner"
              )}
            </ActionButton>
          )}
        </ActionButtonsWrapper>
      </ImageWrapper>
      {parsedCaption && <Caption>{parsedCaption}</Caption>}
      {post?.collectModule && (
        <CollectModal
          isOpen={modalIsOpen}
          onClose={() => {
            setModalIsOpen(false);
          }}
          collectSettings={post.collectModule}
          collect={collect}
          collectLoading={collectLoading}
          memeTitle={title}
        />
      )}
    </MemeWrapper>
  );
}

export default Meme;
