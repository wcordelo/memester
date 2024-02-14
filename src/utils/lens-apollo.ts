// Adapted from files in
// https://github.com/lensterxyz/lenster/blob/main/src/lib/
// Thanks! ❤️

import { FieldPolicy, StoreValue } from "@apollo/client/core";

import { PageInfo } from "../types/lens";

interface CursorBasedPagination<T = StoreValue> {
  items: T[];
  pageInfo: PageInfo;
}

type SafeReadonly<T> = T extends object ? Readonly<T> : T;

export function cursorBasedPagination<T extends CursorBasedPagination>(
  keyArgs: FieldPolicy["keyArgs"],
): FieldPolicy<T> {
  return {
    keyArgs,

    read(existing: SafeReadonly<T> | undefined, { canRead }): SafeReadonly<T> | undefined {
      if (!existing) {
        return existing;
      }

      const { items, pageInfo } = existing;

      // items that are not in the cache anymore (for .e.g deleted publication)
      const danglingItems = items?.filter((item) => !canRead(item));
      const totalCount = pageInfo?.totalCount ?? 0;
      const danglingItemsLength = danglingItems?.length ?? 0;

      return {
        ...existing,
        items,
        pageInfo: {
          ...pageInfo,
          // reduce total count by excluding dangling items so it won't cause a new page query
          // after item was removed from the cache (for .e.g deleted publication)
          totalCount: totalCount - danglingItemsLength,
        },
      };
    },

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>): SafeReadonly<T> {
      if (!existing) {
        return incoming;
      }

      // there is always a chance (for .e.g notification total count) that `items` was not queried
      // if that's the case assume empty array
      const existingItems = existing.items ?? [];
      const incomingItems = incoming.items ?? [];

      // Remove duplicates
      const newIncomingItems = incomingItems.filter((inc) => {
        return (
          existingItems.find((ex) => {
            return JSON.stringify(ex) === JSON.stringify(inc);
          }) === undefined
        );
      });

      return {
        ...incoming,
        items: existingItems.concat(newIncomingItems),
        // TODO: Seems to be broken at least for notifications where count query requests
        // only `totalCount` and list query get's only `next`
        pageInfo: incoming?.pageInfo,
      };
    },
  };
}

/* eslint-disable @typescript-eslint/restrict-template-expressions */
/**
 *
 * @param publication The publication to get the key fields from.
 * @returns key fields of the publication.
 */
export const publicationKeyFields = (publication: any): string => {
  return `${publication.__typename}:${JSON.stringify({
    id: publication.id,
    collectedBy: publication.collectedBy?.address,
    createdAt: publication.createdAt,
  })}`;
};
