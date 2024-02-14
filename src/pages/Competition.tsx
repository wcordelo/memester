import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { useTitle } from "react-use";
import styled from "styled-components";

import Header from "../components/category/Header";
import HomeFeed from "../components/home/HomeFeed";
import Button from "../components/theme/Button";
import Sleepy from "../components/theme/Sleepy";
import { ButtonLink, PageWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";
import { usePublication } from "../hooks/api/publication";
import {
  useCompetitionCreation,
  useCompetitionEndTimestamp,
  useCompetitionPickWinner,
} from "../hooks/contract/competitions/competition";
import useCompetitionWinnersStore from "../state/compwinners";
import { truncateString } from "../utils";

const HeaderDetails = styled.div`
  margin-top: 16px;

  p {
    margin: 0 6px;
    display: inline-block;
  }
`;

const HeaderButton = styled.div`
  width: 100%;
  display: flex;
  margin-top: 16px;
  justify-content: center;
`;

interface ComeptitionType {
  title: string;
  description: string;
  creator: string;
}

function Competition(): JSX.Element {
  const [competition, setCompetition] = useState<ComeptitionType | null>(null);
  const [competitionOver, setCompetitionOver] = useState<boolean>(false);
  const [endsText, setEndsText] = useState<string>("Competition ends in: ... ");
  const { competitionWinners, setCompetitionWinners } = useCompetitionWinnersStore();

  const { competitionId } = useParams();

  const { data: publicationIds, error: publicationError } = useCompetitionCreation(competitionId);
  const { data: competitionEnd } = useCompetitionEndTimestamp(competitionId);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (publicationIds?.length === 2) {
      setPublicationId(`${publicationIds[0].toHexString()}-${publicationIds[1].toHexString()}`);
    }
  }, [publicationIds]);

  const [publicationId, setPublicationId] = useState<string | undefined>();

  const { data } = usePublication(publicationId);

  useEffect(() => {
    if (competition && competitionId && publicationId) {
      setLoading(false);
    }
    if (publicationError) {
      setLoading(false);
    }
  }, [competition, competitionId, publicationId, publicationError]);

  useEffect(() => {
    if (data?.publication?.metadata?.description && data?.publication?.metadata?.content && competitionId) {
      const descriptionWithoutShare = data.publication.metadata.content.replace(
        /\n\nWe are running a competition on @memester-xyz.lens! Go to https:\/\/(testnet.)?memester.xyz to submit your entry!/gm,
        "",
      );

      setCompetition({
        title: data.publication.metadata.name,
        description: descriptionWithoutShare,
        creator: data.publication.profile.handle,
      });
    }
  }, [data]);

  useEffect(() => {
    if (competitionEnd) {
      const isOver = moment(parseInt(competitionEnd.toString()) * 1000).diff(moment()) < 0;
      setCompetitionOver(isOver);
      if (isOver) {
        setEndsText("Competition finished");
      } else {
        setEndsText(`Competition ends: ${moment(parseInt(competitionEnd.toString()) * 1000).fromNow()}`);
      }
    }
  }, [competitionEnd]);

  useTitle(`${competition?.title ?? "Competition"} ${SUBTITLE}`);

  const {
    write: pickWinner,
    isLoading: pickWinnerLoading,
    status: pickWinnerStatus,
  } = useCompetitionPickWinner(competitionId, competitionWinners);

  useEffect(() => {
    if (pickWinnerStatus === "success") {
      setCompetitionWinners([]);
    }
  }, [pickWinnerStatus]);

  return (
    <PageWrapper>
      {loading && <FontAwesomeIcon icon={faSpinner} spinPulse />}
      {competition && competitionId && publicationId ? (
        <>
          <Header
            supertitle={`#competition/${competitionId}`}
            title={truncateString(competition.title, 30)}
            subtitle={truncateString(competition.description, 100)}>
            <HeaderDetails>
              <p title={moment(parseInt(competitionEnd?.toString() ?? "0") * 1000).toLocaleString()}>{endsText}</p>
              <p>|</p>
              <p>
                Hosted by: <ButtonLink to={`/user/${competition.creator}`}>@{competition.creator}</ButtonLink>
              </p>
            </HeaderDetails>

            <HeaderButton>
              <ButtonLink to={`/meme/create/${competitionId}`}>
                <Button disabled={competitionOver} variant="normal" large>
                  Submit Meme
                </Button>
              </ButtonLink>
              {competitionWinners.length > 0 && (
                <Button
                  style={{ marginLeft: "10px" }}
                  disabled={pickWinnerLoading !== undefined && pickWinnerLoading}
                  onClick={() => {
                    pickWinner?.();
                  }}
                  variant="colored">
                  {pickWinnerLoading ? (
                    <div style={{ height: "19px" }}>
                      <FontAwesomeIcon icon={faSpinner} style={{ height: "18px" }} spinPulse />
                    </div>
                  ) : (
                    `Select ${competitionWinners.length} winner${competitionWinners.length !== 1 ? "s" : ""}`
                  )}
                </Button>
              )}
            </HeaderButton>
          </Header>
          <HomeFeed competitionId={competitionId} publicationId={publicationId} />
          <Helmet>
            <meta property="og:title" content={`View the ${competition.title} competition on memester`} />
            <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
          </Helmet>
        </>
      ) : (
        !loading && <Sleepy title={`No competition found!`} />
      )}
    </PageWrapper>
  );
}

export default Competition;
