import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { useProfile } from "./profile";

export interface CountResponse {
  [key: string]: {
    pageInfo: {
      totalCount: number;
    };
  };
}

export interface AllPublicationsTagsResponse {
  allPublicationsTags: {
    items: Array<{ tag: string; total: number }>;
  };
}

const TAGS_COUNT_QUERY = `
  query AllPublicationsTags {
    allPublicationsTags(
      request: {
        source: "memester",
        sort: ALPHABETICAL
      }
    ) {
      items {
        tag
        total
      }
    }
  }
`;

export const useCategoryCount = (): Record<string, number> | undefined => {
  const [results, setResults] = useState<Record<string, number> | undefined>();

  const { data: dataDankest } = useProfile(import.meta.env.VITE_DANKEST_POSTS_USERNAME);
  const { data: dataTags } = useQuery<AllPublicationsTagsResponse>(gql(TAGS_COUNT_QUERY));

  useEffect(() => {
    const res: Record<string, number> = {};

    if (dataDankest?.profile?.stats.totalMirrors && dataDankest?.profile?.stats.totalPosts) {
      res.dankest = dataDankest.profile.stats.totalMirrors + dataDankest.profile.stats.totalPosts;
    }

    // TODO: Uncomment once the tag count issue is fixed
    // https://github.com/lens-protocol/api-examples/issues/106
    // if (dataTags) {
    //   for (const item of dataTags.allPublicationsTags.items) {
    //     res[item.tag] = item.total;
    //   }
    // }

    setResults(res);
  }, [dataTags, dataDankest]);

  return results;
};
