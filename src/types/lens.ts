import { MetadataResponse } from "./metadata";
import { CollectModuleTypes } from "./modules";

export interface Profile {
  profileId: string;
  id?: string;
  name?: string;
  handle: string;
  picture?: {
    original?: {
      url?: string;
    };
  };
  ownedBy: string;
  isFollowedByMe?: boolean;
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    totalPosts: number;
    totalComments: number;
    totalMirrors: number;
    totalPublications: number;
    totalCollects: number;
  };
}

export interface DefaultProfile extends Omit<Profile, "profileId"> {
  id: string;
}

export enum PublicationSortCriteria {
  TOP_COMMENTED = "TOP_COMMENTED",
  TOP_COLLECTED = "TOP_COLLECTED",
  TOP_MIRRORED = "TOP_MIRRORED",
  CURATED_PROFILES = "CURATED_PROFILES",
  LATEST = "LATEST",
}

export enum PublicationType {
  POST = "POST",
  COMMENT = "COMMENT",
  MIRROR = "MIRROR",
}

export enum FeedEventItemTypes {
  POST = "POST",
  COMMENT = "COMMENT",
  MIRROR = "MIRROR",
  COLLECT_POST = "COLLECT_POST",
  COLLECT_COMMENT = "COLLECT_COMMENT",
  REACTION_POST = "REACTION_POST",
  REACTION_COMMENT = "REACTION_COMMENT",
}

export interface CollectModuleResponse {
  type: CollectModuleTypes;
  contractAddress: string;
  // below only present in case where `type` is "MultirecipientFeeCollectModule"
  amount?: {
    asset: {
      address: string;
      decimals: number;
      name: string;
    };
    value: string;
  };
  recipients?: Array<{
    recipient: string;
    split: number;
  }>;
}

// Relevant data from a post
export interface Post {
  id: string;
  profile: Profile;
  stats: {
    totalAmountOfMirrors: number;
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
  };
  metadata: MetadataResponse;
  createdAt: string;
  collectedBy: {
    address: string;
  };
  collectModule: CollectModuleResponse;
  hasCollectedByMe?: boolean;
  mirrors?: string[];
  mirrorOf?: Post;
  appId?: string;
  mainPost?: Post;
}

export interface PostWithMedia extends Post {
  metadata: MetadataResponse;
}

export interface RootPost {
  root: Post;
}

export function postHasMedia(post: Post | RootPost): post is PostWithMedia {
  if ((post as RootPost)?.root) {
    post = (post as RootPost).root;
  }
  return (post as PostWithMedia).metadata.media !== undefined && (post as PostWithMedia).metadata.media.length > 0;
}

export interface PageInfo {
  prev: string;
  next: string;
  totalCount: number;
}

export interface TypedData {
  types: any;
  domain: any;
  value: any;
}

export interface TypedDataResponse {
  id: string;
  expiresAt: string;
  typedData: TypedData;
}
