// Helpful script for FeaturedMemeTemplates

const ACCESS_TOKEN = "Bearer ";

const ids = [
  "0x0146f5-0x65",
  "0x0146f5-0x67",
  "0x0146f5-0x73",
  "0x0146f5-0x66",
  "0x0146f5-0x63",
  "0x0146f5-0x6a",
  "0x0146f5-0x68",
  "0x0146f5-0x70",
  "0x0146f5-0x72",
  "0x0146f5-0x69",
  "0x0146f5-0x6b",
  "0x0146f5-0x6e",
  "0x0146f5-0x6c",
  "0x0146f5-0x6d",
  "0x0146f5-0x6f",
  "0x0146f5-0x64",
  "0x0146f5-0x74",
  "0x0146f5-0x71",
  "0x0146f5-0x61",
  "0x0146f5-0x60",
  "0x0146f5-0x62",
  "0x0146f5-0x5e",
  "0x0146f5-0x5f",
  "0x0146f5-0x5d",
];

const newMemes = await Promise.all(
  ids.map(async (id) => {
    const response = await fetch("https://api.lens.dev/", {
      credentials: "omit",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "content-type": "application/json",
        "x-access-token": ACCESS_TOKEN,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      referrer: "https://memester.xyz/",
      body: `{"variables":{"request":{"publicationId":"${id}"}},"query":"query ($request: PublicationQueryRequest!, $profileId: ProfileId) {\\n  publication(request: $request) {\\n    __typename\\n    ... on Post {\\n      ...PostFields\\n      __typename\\n    }\\n    ... on Comment {\\n      ...CommentFields\\n      __typename\\n    }\\n    ... on Mirror {\\n      ...MirrorFields\\n      __typename\\n    }\\n  }\\n}\\n\\nfragment MediaFields on Media {\\n  url\\n  mimeType\\n  __typename\\n}\\n\\nfragment ProfileFields on Profile {\\n  id\\n  name\\n  bio\\n  attributes {\\n    displayType\\n    traitType\\n    key\\n    value\\n    __typename\\n  }\\n  isFollowedByMe\\n  isFollowing(who: null)\\n  followNftAddress\\n  metadata\\n  isDefault\\n  handle\\n  picture {\\n    ... on NftImage {\\n      contractAddress\\n      tokenId\\n      uri\\n      verified\\n      __typename\\n    }\\n    ... on MediaSet {\\n      original {\\n        ...MediaFields\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  coverPicture {\\n    ... on NftImage {\\n      contractAddress\\n      tokenId\\n      uri\\n      verified\\n      __typename\\n    }\\n    ... on MediaSet {\\n      original {\\n        ...MediaFields\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  ownedBy\\n  dispatcher {\\n    address\\n    __typename\\n  }\\n  stats {\\n    totalFollowers\\n    totalFollowing\\n    totalPosts\\n    totalComments\\n    totalMirrors\\n    totalPublications\\n    totalCollects\\n    __typename\\n  }\\n  followModule {\\n    ... on FeeFollowModuleSettings {\\n      type\\n      amount {\\n        asset {\\n          name\\n          symbol\\n          decimals\\n          address\\n          __typename\\n        }\\n        value\\n        __typename\\n      }\\n      recipient\\n      __typename\\n    }\\n    ... on ProfileFollowModuleSettings {\\n      type\\n      __typename\\n    }\\n    ... on RevertFollowModuleSettings {\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment PublicationStatsFields on PublicationStats {\\n  totalAmountOfMirrors\\n  totalAmountOfCollects\\n  totalAmountOfComments\\n  __typename\\n}\\n\\nfragment MetadataOutputFields on MetadataOutput {\\n  name\\n  description\\n  content\\n  media {\\n    original {\\n      ...MediaFields\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    displayType\\n    traitType\\n    value\\n    __typename\\n  }\\n  tags\\n  __typename\\n}\\n\\nfragment Erc20Fields on Erc20 {\\n  name\\n  symbol\\n  decimals\\n  address\\n  __typename\\n}\\n\\nfragment CollectModuleFields on CollectModule {\\n  __typename\\n  ... on FreeCollectModuleSettings {\\n    type\\n    followerOnly\\n    contractAddress\\n    __typename\\n  }\\n  ... on FeeCollectModuleSettings {\\n    type\\n    amount {\\n      asset {\\n        ...Erc20Fields\\n        __typename\\n      }\\n      value\\n      __typename\\n    }\\n    recipient\\n    referralFee\\n    __typename\\n  }\\n  ... on LimitedFeeCollectModuleSettings {\\n    type\\n    collectLimit\\n    amount {\\n      asset {\\n        ...Erc20Fields\\n        __typename\\n      }\\n      value\\n      __typename\\n    }\\n    recipient\\n    referralFee\\n    __typename\\n  }\\n  ... on LimitedTimedFeeCollectModuleSettings {\\n    type\\n    collectLimit\\n    amount {\\n      asset {\\n        ...Erc20Fields\\n        __typename\\n      }\\n      value\\n      __typename\\n    }\\n    recipient\\n    referralFee\\n    endTimestamp\\n    __typename\\n  }\\n  ... on RevertCollectModuleSettings {\\n    type\\n    __typename\\n  }\\n  ... on TimedFeeCollectModuleSettings {\\n    type\\n    amount {\\n      asset {\\n        ...Erc20Fields\\n        __typename\\n      }\\n      value\\n      __typename\\n    }\\n    recipient\\n    referralFee\\n    endTimestamp\\n    __typename\\n  }\\n}\\n\\nfragment PostFields on Post {\\n  id\\n  profile {\\n    ...ProfileFields\\n    __typename\\n  }\\n  stats {\\n    ...PublicationStatsFields\\n    __typename\\n  }\\n  metadata {\\n    ...MetadataOutputFields\\n    __typename\\n  }\\n  createdAt\\n  collectModule {\\n    ...CollectModuleFields\\n    __typename\\n  }\\n  referenceModule {\\n    ... on FollowOnlyReferenceModuleSettings {\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n  appId\\n  hidden\\n  reaction(request: null)\\n  mirrors(by: $profileId)\\n  hasCollectedByMe\\n  __typename\\n}\\n\\nfragment MirrorBaseFields on Mirror {\\n  id\\n  profile {\\n    ...ProfileFields\\n    __typename\\n  }\\n  stats {\\n    ...PublicationStatsFields\\n    __typename\\n  }\\n  metadata {\\n    ...MetadataOutputFields\\n    __typename\\n  }\\n  createdAt\\n  collectModule {\\n    ...CollectModuleFields\\n    __typename\\n  }\\n  referenceModule {\\n    ... on FollowOnlyReferenceModuleSettings {\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n  appId\\n  hidden\\n  reaction(request: null)\\n  hasCollectedByMe\\n  __typename\\n}\\n\\nfragment MirrorFields on Mirror {\\n  ...MirrorBaseFields\\n  mirrorOf {\\n    ... on Post {\\n      ...PostFields\\n      __typename\\n    }\\n    ... on Comment {\\n      ...CommentFields\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CommentBaseFields on Comment {\\n  id\\n  profile {\\n    ...ProfileFields\\n    __typename\\n  }\\n  stats {\\n    ...PublicationStatsFields\\n    __typename\\n  }\\n  metadata {\\n    ...MetadataOutputFields\\n    __typename\\n  }\\n  createdAt\\n  collectModule {\\n    ...CollectModuleFields\\n    __typename\\n  }\\n  referenceModule {\\n    ... on FollowOnlyReferenceModuleSettings {\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n  appId\\n  hidden\\n  reaction(request: null)\\n  mirrors(by: null)\\n  hasCollectedByMe\\n  __typename\\n}\\n\\nfragment CommentFields on Comment {\\n  ...CommentBaseFields\\n  mainPost {\\n    ... on Post {\\n      ...PostFields\\n      __typename\\n    }\\n    ... on Mirror {\\n      ...MirrorBaseFields\\n      mirrorOf {\\n        ... on Post {\\n          ...PostFields\\n          __typename\\n        }\\n        ... on Comment {\\n          ...CommentMirrorOfFields\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CommentMirrorOfFields on Comment {\\n  ...CommentBaseFields\\n  mainPost {\\n    ... on Post {\\n      ...PostFields\\n      __typename\\n    }\\n    ... on Mirror {\\n      ...MirrorBaseFields\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}"}`,
      method: "POST",
      mode: "cors",
    });

    const json = await response.json();

    const originalUrl = json.data.publication.metadata.media[0].original.url;

    const url = originalUrl.replace("ipfs://", "");

    return {
      url: `\`\${import.meta.env.VITE_IPFS_GATEWAY_URL}${url}\``,
      id,
    };
  }),
);

console.log(newMemes);
