import { Skeleton } from "@mui/material";
import { styled as mStyled } from "@mui/system";
import { Fragment, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { CompetitionType } from "../../constants";
import { ExploreResponse, FeedResponse, GenericTimelineParams, useGenericTimeline } from "../../hooks/api/explore";
import { GetPublicationsResponse } from "../../hooks/api/publication";
import { useCompetitionImplementation, useCompetitionWinners } from "../../hooks/contract/competitions/competition";
import { useCompetitionJudge } from "../../hooks/contract/competitions/judge";
import { postHasMedia, PostWithMedia } from "../../types/lens";
import { implementationContractType } from "../../utils";
import ContinuousScroll from "../ContinuousScroll";
import ErrorContainer from "../theme/ErrorContainer";
import Meme from "../theme/Meme";
import Sleepy from "../theme/Sleepy";

const PostSkeleton = mStyled(Skeleton)`
  border-radius: 32px;
  margin-bottom: 30px;
`;

export type GenericTimelineProps = GenericTimelineParams & {
  competitionId?: string;
  errorMessage: string;
};

function GenericTimeline({
  profileId,
  competitionId,
  publicationId,
  tags,
  sortCriteria,
  timelineType,
  errorMessage,
}: GenericTimelineProps): JSX.Element {
  const { address } = useAccount();

  const [memes, setMemes] = useState<PostWithMedia[]>([]);
  const [isJudge, setIsJudge] = useState<boolean>(false);
  const [competitionType, setCompetitionType] = useState<CompetitionType | undefined>(undefined);

  const { data, error, loading, variables, refetch, fetchMore } = useGenericTimeline({
    profileId,
    publicationId,
    tags,
    sortCriteria,
    timelineType,
  });

  const { data: judge } = useCompetitionJudge(competitionId);
  const { data: winners } = useCompetitionWinners(competitionId);
  const implementation = useCompetitionImplementation(competitionId);

  useEffect(() => {
    if (implementation) {
      setCompetitionType(implementationContractType(implementation));
    }
  }, [implementation]);

  useEffect(() => {
    if (judge) {
      setIsJudge(judge === address);
    }
  }, [judge]);

  const getPosts = (response: FeedResponse | ExploreResponse | GetPublicationsResponse): PostWithMedia[] => {
    if ((response as FeedResponse).feed) {
      return (response as FeedResponse).feed.items.filter(postHasMedia).map((item) => item.root);
    }
    if ((response as GetPublicationsResponse).publications) {
      return (response as GetPublicationsResponse).publications.items
        .map((item) =>
          item.profile?.id === import.meta.env.VITE_DANKEST_POSTS_USERID && item.mirrorOf ? item.mirrorOf : item,
        )
        .filter(postHasMedia);
    }
    if ((response as ExploreResponse).explorePublications) {
      return (response as ExploreResponse).explorePublications.items.filter(postHasMedia);
    }
    return [];
  };

  const getNext = (response: FeedResponse | ExploreResponse | GetPublicationsResponse): string | undefined => {
    if ((response as FeedResponse).feed) {
      return (response as FeedResponse).feed.pageInfo.next;
    }
    if ((response as GetPublicationsResponse).publications) {
      return (response as GetPublicationsResponse).publications.pageInfo.next;
    }
    if ((response as ExploreResponse).explorePublications) {
      return (response as ExploreResponse).explorePublications.pageInfo.next;
    }
  };

  useEffect(() => {
    if (data) {
      setMemes(getPosts(data));
    }
  }, [data]);

  return (
    <Fragment>
      {data ? (
        <>
          {memes.length > 0 ? (
            <>
              {memes.map((item, index) => (
                <Meme
                  title={item.metadata.name}
                  tags={item.metadata.tags}
                  user={item.profile.handle}
                  timestamp={item.createdAt}
                  image={item.metadata.media[0].original.url}
                  caption={item.metadata.content}
                  numberOfComments={item.stats.totalAmountOfComments}
                  numberOfMirrors={item.stats.totalAmountOfMirrors}
                  numberOfCollects={item.stats.totalAmountOfCollects}
                  hasCollectedByMe={item.hasCollectedByMe}
                  mirroredId={item.mirrors?.[0]}
                  post={item}
                  id={item.id}
                  key={`${item.id}-${index}`}
                  winners={winners}
                  competitionId={competitionId}
                  competitionType={competitionType}
                  isJudge={isJudge}
                  onCompleted={() => {
                    refetch().catch(console.error);
                  }}
                />
              ))}
              <ContinuousScroll
                enabled={!!getNext(data)}
                onView={() => {
                  if (variables) {
                    variables.request.cursor = getNext(data);

                    fetchMore({
                      variables,
                    }).catch(console.error);
                  }
                }}
              />
            </>
          ) : (
            <Sleepy title={errorMessage} />
          )}
        </>
      ) : error ? (
        <ErrorContainer error={error} />
      ) : loading ? (
        <>
          {[1, 2, 3].map((i) => {
            return (
              <PostSkeleton sx={{ bgcolor: "#999999" }} key={i} variant="rectangular" width={"100%"} height={700} />
            );
          })}
        </>
      ) : (
        <ErrorContainer error={new Error(errorMessage)} />
      )}
    </Fragment>
  );
}

export default GenericTimeline;
