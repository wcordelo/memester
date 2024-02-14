import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { useTitle } from "react-use";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { SUBTITLE } from "../../constants";
import { useDefaultProfile } from "../../hooks/api/profile";
import { usePublication } from "../../hooks/api/publication";
import { useTemplate } from "../../hooks/utils/template";
import { parseIPFSURL } from "../../utils";
import ErrorContainer from "../theme/ErrorContainer";
import Feed from "../theme/Feed";
import Meme from "../theme/Meme";
import Sleepy from "../theme/Sleepy";
import Comments from "./Comments";

const MemeBox = styled(Meme)`
  max-width: 700px;
`;

function PublicationFeed(): JSX.Element {
  const { publicationId } = useParams();

  const { address } = useAccount();
  const { defaultProfile } = useDefaultProfile(address);

  const { data, error, loading, refetch } = usePublication(publicationId, defaultProfile?.id);

  useTitle(`${data?.publication?.metadata.name ?? "No meme found"} ${SUBTITLE}`);

  // Preload the cache and browser with template
  useTemplate(publicationId);

  return (
    <Feed>
      {publicationId && data?.publication ? (
        <>
          {data.publication.metadata.media[0] ? (
            <>
              <MemeBox
                title={data.publication.metadata.name}
                tags={data.publication.metadata.tags}
                user={data.publication.profile.handle}
                timestamp={data.publication.createdAt}
                image={data.publication.metadata.media[0].original.url}
                caption={data.publication.metadata.content}
                numberOfComments={data.publication.stats.totalAmountOfComments}
                numberOfMirrors={data.publication.stats.totalAmountOfMirrors}
                numberOfCollects={data.publication.stats.totalAmountOfCollects}
                hasCollectedByMe={data.publication.hasCollectedByMe}
                mirroredId={data.publication.mirrors?.[0]}
                post={data.publication}
                id={data.publication.id}
                key={data.publication.id}
                onCompleted={() => {
                  refetch().catch(console.error);
                }}
              />
              <Helmet>
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                  property="og:title"
                  content={`View '${data.publication.metadata.name}' by @${data.publication.profile.handle} on memester`}
                />
                <meta property="og:image" content={parseIPFSURL(data.publication.metadata.media[0].original.url)} />
              </Helmet>
            </>
          ) : (
            <Sleepy title="No meme found in this publication!" />
          )}
          <Comments publicationId={publicationId} />
        </>
      ) : error ? (
        <ErrorContainer error={error} />
      ) : loading ? (
        // TODO: Skeleton the UI elements
        <FontAwesomeIcon icon={faSpinner} spinPulse />
      ) : (
        <ErrorContainer
          error={new Error(`No meme found for publication id: ${publicationId ?? "no publication id"}`)}
        />
      )}
    </Feed>
  );
}

export default PublicationFeed;
