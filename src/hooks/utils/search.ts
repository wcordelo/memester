import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

import { parseIPFSURL } from "../../utils";
import { useSearch as useSearchAPI } from "../api/search";

interface SearchResults {
  text: string;
  image?: string;
  URL?: string;
}

export const useSearch = (query: string): SearchResults[] | undefined => {
  const [results, setResults] = useState<SearchResults[] | undefined>();
  const [debouncedQuery, setDebouncedQuery] = useState<string | undefined>();

  useDebounce(
    () => {
      setDebouncedQuery(query);
    },
    500,
    [query],
  );

  const { data } = useSearchAPI(debouncedQuery);

  useEffect(() => {
    if (data?.search?.items && debouncedQuery) {
      if (data?.search?.items.length > 0) {
        setResults(
          data?.search?.items
            .map((item) => {
              return {
                text: `user: ${item.handle}`,
                image: parseIPFSURL(item.picture?.original?.url),
                URL: `/user/${item.handle}`,
              };
            })
            .concat({
              text: `category: ${debouncedQuery}`,
              image: undefined,
              URL: `/category/${debouncedQuery}`,
            }),
        );
      } else {
        setResults([{ text: "No results found..." }]);
      }
    } else {
      setResults(undefined);
    }
  }, [data]);

  return results;
};
