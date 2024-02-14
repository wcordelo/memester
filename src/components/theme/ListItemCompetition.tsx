import { BigNumber } from "ethers";
import moment from "moment";

import { usePublication } from "../../hooks/api/publication";
import { parseIPFSURL } from "../../utils";
import ListItem from "./ListItem";

interface ListItemCompetitionProps {
  competitionId: string;
  publicationId: string;
  endTimestamp: BigNumber;
  pinned?: boolean;
}

function ListItemCompetition({
  competitionId,
  publicationId,
  endTimestamp,
  pinned,
}: ListItemCompetitionProps): JSX.Element {
  const { data } = usePublication(publicationId);

  const finished = endTimestamp.toNumber() * 1000 < Date.now();

  const subtitle = finished ? "Finished" : `Ends: ${moment(endTimestamp.toNumber() * 1000).fromNow()}`;

  return data?.publication?.metadata.description ? (
    <ListItem
      href={`/competition/${competitionId.toString()}`}
      title={data?.publication?.metadata.description ?? ""}
      subtitle={subtitle}
      image={data?.publication?.metadata.media[0] && parseIPFSURL(data?.publication?.metadata.media[0].original.url)}
      imageStretch={data?.publication?.metadata.media[0] !== undefined}
      pinned={pinned}
    />
  ) : (
    <></>
  );
}

export default ListItemCompetition;
