import { gql, QueryResult, useQuery } from "@apollo/client";

import { FeedEventItemTypes, PageInfo, Post, PublicationSortCriteria, PublicationType } from "../../types/lens";
import { PublicationMainFocus } from "../../types/metadata";
import {
  GetPublicationsRequest,
  GetPublicationsResponse,
  usePublicationsCompetition,
  usePublicationsDankest,
} from "./publication";

interface ExploreRequest {
  request: {
    sortCriteria?: PublicationSortCriteria;
    publicationTypes?: PublicationType[];
    limit: number;
    noRandomize?: boolean;
    timestamp?: number;
    metadata?: {
      tags?: {
        oneOf: string[];
      };
      mainContentFocus?: PublicationMainFocus;
    };
    sources: string[];
    cursor?: string;
  };
  profileId?: string;
}

// more: https://docs.lens.xyz/docs/explore-publications
export interface ExploreResponse {
  explorePublications: {
    items: Post[];
    pageInfo: PageInfo;
  };
}

interface FeedRequest {
  request: {
    profileId?: string;
    feedEventItemTypes?: FeedEventItemTypes[];
    limit: number;
    metadata?: {
      mainContentFocus?: PublicationMainFocus;
    };
    sources: string[];
    cursor?: string;
  };
  profileId?: string;
}

// more: https://docs.lens.xyz/docs/profile-feed
export interface FeedResponse {
  feed: {
    items: Array<{
      root: Post;
    }>;
    pageInfo: PageInfo;
  };
}

export interface GenericTimelineParams {
  profileId?: string;
  publicationId?: string;
  tags?: string[];
  sortCriteria?: PublicationSortCriteria;
  timelineType: "profile" | "tagged" | "latest" | "special" | "competition";
}

const EXPLORE_PUBLICATIONS = gql`
  query ExplorePublications($request: ExplorePublicationRequest!, $profileId: ProfileId) {
    explorePublications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
        type
      }
      ... on RevertFollowModuleSettings {
        type
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
      small {
        ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
    tags
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on FreeCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on MultirecipientFeeCollectModuleSettings {
      type
      contractAddress
      amount {
        asset {
          address
          decimals
          name
          symbol
        }
        value
      }
      referralFee
      followerOnly
      recipients {
        recipient
        split
      }
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    collectedBy {
      ...WalletFields
    }
    hidden
    reaction(request: null)
    mirrors(by: $profileId)
    hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    collectedBy {
      ...WalletFields
    }
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }

  fragment WalletFields on Wallet {
    address
    defaultProfile {
      ...ProfileFields
    }
  }
`;

const GET_FEED = gql`
  query Feed($request: FeedRequest!, $profileId: ProfileId) {
    feed(request: $request) {
      items {
        root {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
        type
      }
      ... on RevertFollowModuleSettings {
        type
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
      small {
        ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
    tags
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on FreeCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on MultirecipientFeeCollectModuleSettings {
      type
      contractAddress
      amount {
        asset {
          address
          decimals
          name
          symbol
        }
        value
      }
      referralFee
      followerOnly
      recipients {
        recipient
        split
      }
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    collectedBy {
      ...WalletFields
    }
    hidden
    reaction(request: null)
    mirrors(by: $profileId)
    hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    hasCollectedByMe
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    collectedBy {
      ...WalletFields
    }
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }

  fragment WalletFields on Wallet {
    address
    defaultProfile {
      ...ProfileFields
    }
  }
`;

export const useTaggedPublications = (
  tags?: string[],
  profileId?: string,
  sortCriteria: PublicationSortCriteria = PublicationSortCriteria.LATEST,
  publicationTypes: PublicationType[] = [PublicationType.POST],
): QueryResult<ExploreResponse, ExploreRequest> => {
  return useQuery<ExploreResponse, ExploreRequest>(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sortCriteria,
        publicationTypes,
        limit: 20,
        metadata: {
          tags: {
            oneOf: tags ?? [],
          },
          mainContentFocus: PublicationMainFocus.IMAGE,
        },
        sources: [import.meta.env.VITE_LENS_APP_ID],
      },
      profileId,
    },
    skip: !tags || tags.length < 0,
  });
};

export const useTrending = (
  profileId?: string,
  sortCriteria: PublicationSortCriteria = PublicationSortCriteria.LATEST,
): QueryResult<ExploreResponse, ExploreRequest> => {
  return useQuery<ExploreResponse, ExploreRequest>(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sortCriteria,
        publicationTypes: [PublicationType.POST],
        limit: 20,
        noRandomize: true,
        metadata: {
          mainContentFocus: PublicationMainFocus.IMAGE,
        },
        sources: [import.meta.env.VITE_LENS_APP_ID],
      },
      profileId,
    },
  });
};

export const useFeed = (profileId?: string): QueryResult<FeedResponse, FeedRequest> => {
  return useQuery<FeedResponse, FeedRequest>(GET_FEED, {
    variables: {
      request: {
        profileId,
        feedEventItemTypes: [
          FeedEventItemTypes.POST,
          FeedEventItemTypes.COLLECT_POST,
          FeedEventItemTypes.MIRROR,
          FeedEventItemTypes.REACTION_POST,
        ],
        limit: 50,
        metadata: {
          mainContentFocus: PublicationMainFocus.IMAGE,
        },
        sources: [import.meta.env.VITE_LENS_APP_ID],
      },
      profileId,
    },
    skip: !profileId,
  });
};

export const useDankestTimeline = (
  profileId?: string,
): QueryResult<GetPublicationsResponse, GetPublicationsRequest> => {
  return usePublicationsDankest(import.meta.env.VITE_DANKEST_POSTS_USERID, profileId);
};

export const useCompetitionTimeline = (
  publicationId?: string,
): QueryResult<GetPublicationsResponse, GetPublicationsRequest> => {
  return usePublicationsCompetition(publicationId);
};

export const useGenericTimeline = ({
  profileId,
  publicationId,
  tags,
  sortCriteria,
  timelineType,
}: GenericTimelineParams):
  | QueryResult<FeedResponse, FeedRequest>
  | QueryResult<ExploreResponse, ExploreRequest>
  | QueryResult<GetPublicationsResponse, GetPublicationsRequest> => {
  switch (timelineType) {
    case "profile":
      return useFeed(profileId);
    case "competition":
      return useCompetitionTimeline(publicationId);
    case "tagged":
      return useTaggedPublications(tags, profileId, sortCriteria);
    case "latest":
      return useTrending(profileId, sortCriteria);
    case "special":
      if (tags?.includes("dankest")) {
        return useDankestTimeline(profileId);
      } else {
        return useTrending(profileId, sortCriteria);
      }
  }
};
