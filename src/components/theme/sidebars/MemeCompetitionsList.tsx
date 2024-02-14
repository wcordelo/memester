import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTour } from "@reactour/tour";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useInterval } from "react-use";
import styled from "styled-components";

import { API_URL, HIDDEN_COMPETITIONS, PINNED_COMPETITIONS, TOUR_COMPETITIONS_SEEN } from "../../../constants";
import useCompetitionEventState, { CompetitionEvent } from "../../../state/events";
import { useLocalStorage } from "../../../store";
import Button from "../Button";
import ListContainer from "../ListContainer";
import ListItemCompetition from "../ListItemCompetition";
import { ButtonLink } from "../Theme";

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.textColor};
  font-size: 11px;
  text-align: center;
`;

export interface MemeCompetitionsListProps {
  showAll?: boolean;
  hideListLink?: boolean;
}

type PinnedEvent = CompetitionEvent & {
  pinned?: boolean;
};

function MemeCompetitionsList({ hideListLink, showAll }: MemeCompetitionsListProps): JSX.Element {
  const { events, setEvents } = useCompetitionEventState();
  const [sortedEvents, setSortedEvents] = useState<PinnedEvent[]>([]);

  const refreshCompetitions = async (): Promise<void> => {
    (async () => {
      const result = await axios.get(`${API_URL}/competitions`);
      const toTyped: CompetitionEvent[] = result.data.map((i: any) => {
        return {
          ...i,
          args: {
            competitionId: ethers.BigNumber.from(i.args[0]),
            profileId: ethers.BigNumber.from(i.args[2].hex),
            pubId: ethers.BigNumber.from(i.args[3].hex),
            endTimestamp: ethers.BigNumber.from(i.args[4].hex),
          },
        };
      });
      setEvents(toTyped);
    })().catch(console.error);
  };

  useEffect(() => {
    refreshCompetitions().catch(console.error);
  }, []);

  useInterval(() => {
    refreshCompetitions().catch(console.error);
  }, 60000);

  const { setIsOpen: setTourOpen } = useTour();
  const [tourSeen, setTourSeen] = useLocalStorage(TOUR_COMPETITIONS_SEEN, false);

  useEffect(() => {
    if (events && !tourSeen) {
      setTimeout(() => {
        setTourOpen(true);
        setTourSeen(true);
      }, 800);
    }
  }, [events, tourSeen]);

  useEffect(() => {
    if (events) {
      setSortedEvents(
        events
          .filter((i) => !HIDDEN_COMPETITIONS.includes(i?.args?.competitionId.toString()))
          .map((i) => (PINNED_COMPETITIONS.includes(i?.args?.competitionId.toString()) ? { pinned: true, ...i } : i))
          .sort((a: PinnedEvent, b: PinnedEvent) => {
            // First sort by pinned status
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            // Calculate time difference from endTimestamp to now
            const currentTime = Date.now() / 1000;
            const aTimeDiff = (a?.args?.endTimestamp?.toNumber() ?? 0) - currentTime;
            const bTimeDiff = (b?.args?.endTimestamp?.toNumber() ?? 0) - currentTime;

            // If both are pinned or both are not pinned, sort by time difference (soonest first, finished last)
            if (aTimeDiff > 0 && bTimeDiff > 0) {
              return aTimeDiff - bTimeDiff;
            } else {
              return bTimeDiff - aTimeDiff;
            }
          }),
      );
    }
  }, [events]);
  return (
    <>
      <ListContainer title="Meme Competitions" className="meme-competitions-container">
        {sortedEvents && sortedEvents.length > 0 ? (
          sortedEvents.slice(0, showAll ? 10000 : 10).map((i, k) => {
            if (
              i?.args?.profileId &&
              i?.args?.pubId &&
              i?.args?.endTimestamp &&
              BigNumber.isBigNumber(i?.args?.pubId) &&
              BigNumber.isBigNumber(i?.args?.profileId) &&
              BigNumber.isBigNumber(i?.args?.endTimestamp)
            ) {
              return (
                <ListItemCompetition
                  competitionId={i?.args?.competitionId.toString()}
                  publicationId={`${i.args.profileId.toHexString()}-${i.args.pubId.toHexString()}`}
                  endTimestamp={i.args.endTimestamp}
                  key={k}
                  pinned={i.pinned}
                />
              );
            }
            return <></>;
          })
        ) : events?.length === 0 ? (
          <p>No competitions yet</p>
        ) : (
          <FontAwesomeIcon icon={faSpinner} spinPulse />
        )}
        {!hideListLink && <StyledLink to="/competition/list">See all</StyledLink>}
        <ButtonLink to="/competition/create" style={{ marginTop: "10px" }}>
          <Button style={{ width: "100%" }}>Host Competition</Button>
        </ButtonLink>
      </ListContainer>
    </>
  );
}

export default MemeCompetitionsList;
