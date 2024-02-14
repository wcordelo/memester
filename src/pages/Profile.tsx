import { useApolloClient } from "@apollo/client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { useTitle } from "react-use";
import styled from "styled-components";
import { useAccount } from "wagmi";

import ContinuousScroll from "../components/ContinuousScroll";
import MemeList, { MemeDetails } from "../components/editor/MemeList";
import FollowButton from "../components/FollowButton";
import ErrorContainer from "../components/theme/ErrorContainer";
import Footer from "../components/theme/Footer";
import Sleepy from "../components/theme/Sleepy";
import { PaddedWrapper, PageWrapper, Subtitle, Title, TransparentWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";
import { useDefaultProfile, useProfile, useProfilePicture } from "../hooks/api/profile";
import { usePublications } from "../hooks/api/publication";
import { postHasMedia } from "../types/lens";
import { nonNullable } from "../utils";

const ProfileWrapper = styled(TransparentWrapper)`
  align-items: center;
  justify-content: center;
`;

const ProfilePictureImage = styled.img`
  width: 125px;
  height: 125px;
  border-radius: 500px;
  margin-top: 12px;
`;

const ProfileStats = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  text-align: center;
`;

const MarginedFollowButton = styled(FollowButton)`
  margin: 12px 0;
`;

const Stat = styled.div`
  min-width: 100px;
  h4 {
    color: ${(props) => props.theme.lightTextColor};
  }
`;

function Profile(): JSX.Element {
  const client = useApolloClient();

  const { handle } = useParams();

  const { data, error, loading, refetch } = useProfile(handle);
  const pfpURL = useProfilePicture(data);

  const { address } = useAccount();
  const { defaultProfile } = useDefaultProfile(address);

  const { data: publicationsData, variables, fetchMore } = usePublications(data?.profile?.id);

  useTitle(`${data?.profile?.handle ?? "No user found"} ${SUBTITLE}`);
  const [memes, setMemes] = useState<MemeDetails[]>([]);

  useEffect(() => {
    setMemes(
      publicationsData?.publications?.items
        .filter(postHasMedia)
        .map((item) => {
          if (item.metadata.media[0].original.url) {
            return {
              id: item.id,
              url: item.metadata.media[0].original.url,
              href: `/meme/${item.id}`,
            };
          } else {
            return undefined;
          }
        })
        .filter(nonNullable) ?? [],
    );
  }, [publicationsData]);

  return (
    <PageWrapper>
      {data?.profile ? (
        <>
          <ProfileWrapper>
            <ProfilePictureImage src={pfpURL} />
            <Title>{data.profile.handle}</Title>
            {data?.profile?.id && data?.profile?.isFollowedByMe !== undefined && defaultProfile?.handle !== handle && (
              <MarginedFollowButton
                profileId={data?.profile?.id}
                isFollowedByMe={data?.profile?.isFollowedByMe}
                onCompleted={() => {
                  refetch().catch(console.error);
                  client
                    .refetchQueries({
                      include: ["ExplorePublications", "GetTimeline"],
                    })
                    .catch(console.error);
                }}
              />
            )}
            {/* TODO: Get join date https://github.com/lens-protocol/api-examples/issues/90 */}
            {/* <Subtitle>{moment(data.profiles.items[0].).fromNow()}</Subtitle> */}

            <ProfileStats>
              <Stat>
                <Subtitle>Followers</Subtitle>
                <Title>{data.profile.stats.totalFollowers}</Title>
              </Stat>
              <Stat>
                <Subtitle>Following</Subtitle>
                <Title>{data.profile.stats.totalFollowing}</Title>
              </Stat>
              <Stat>
                <Subtitle>Posts</Subtitle>
                <Title>{data.profile.stats.totalPosts}</Title>
              </Stat>
              <Stat>
                <Subtitle>Mirrors</Subtitle>
                <Title>{data.profile.stats.totalMirrors}</Title>
              </Stat>
              <Stat>
                <Subtitle>Collects</Subtitle>
                <Title>{data.profile.stats.totalCollects}</Title>
              </Stat>
            </ProfileStats>
          </ProfileWrapper>
          <PaddedWrapper>
            {publicationsData?.publications?.items.length === 0 ? (
              <Sleepy title={`No memes made by ${data.profile.handle} yet!`} />
            ) : memes.length > 0 ? (
              <>
                <MemeList memes={memes} selectMode={false} />
                <ContinuousScroll
                  enabled={memes.length < (publicationsData?.publications?.pageInfo.totalCount ?? 0)}
                  onView={() => {
                    if (variables) {
                      variables.request.cursor = publicationsData?.publications?.pageInfo.next;
                      fetchMore({
                        variables,
                      }).catch(console.error);
                    }
                  }}
                />
              </>
            ) : (
              <FontAwesomeIcon icon={faSpinner} spinPulse />
            )}
          </PaddedWrapper>
          <Helmet>
            <meta property="og:title" content={`View @${data.profile.handle}'s profile on memester`} />
            <meta property="og:image" content={pfpURL} />
          </Helmet>
        </>
      ) : loading ? (
        // TODO: Skeleton the UI elements
        <PaddedWrapper>
          <FontAwesomeIcon icon={faSpinner} spinPulse />
        </PaddedWrapper>
      ) : error ? (
        <PaddedWrapper>
          <ErrorContainer error={error} />
        </PaddedWrapper>
      ) : (
        <PaddedWrapper>
          <ErrorContainer error={new Error(`No user found for handle: ${handle ?? "no handle"}`)} />
        </PaddedWrapper>
      )}

      <PaddedWrapper>
        <Footer />
      </PaddedWrapper>
    </PageWrapper>
  );
}

export default Profile;
