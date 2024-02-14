import { PublicationSortCriteria } from "./lens";

export interface Category {
  tag: string;
  title: string;
}

type SpecialCategoryTags = "latest" | "top-commented" | "top-collected" | "top-mirrored" | "dankest";

type SpecialToSortCriteriaMap = {
  [category in SpecialCategoryTags]: PublicationSortCriteria;
};

export const SpecialCategoryTagToSortCriteria: SpecialToSortCriteriaMap = {
  dankest: PublicationSortCriteria.LATEST,
  latest: PublicationSortCriteria.LATEST,
  "top-commented": PublicationSortCriteria.TOP_COMMENTED,
  "top-collected": PublicationSortCriteria.TOP_COLLECTED,
  "top-mirrored": PublicationSortCriteria.TOP_MIRRORED,
};

interface SpecialCategory {
  tag: SpecialCategoryTags;
  title: string;
}

export const TopCategories: SpecialCategory[] = [
  {
    tag: "top-commented",
    title: "Top Commented",
  },
  {
    tag: "top-collected",
    title: "Top Collected",
  },
  {
    tag: "top-mirrored",
    title: "Top Mirrored",
  },
];

export const SpecialCategories: SpecialCategory[] = [
  {
    tag: "latest",
    title: "Latest",
  },
  {
    tag: "dankest",
    title: "Dankest",
  },
  ...TopCategories,
];

export const DefaultCategories = [
  {
    tag: "funny",
    title: "Funny",
  },
  {
    tag: "news",
    title: "News",
  },
  {
    tag: "crypto",
    title: "Crypto",
  },
  {
    tag: "bitcoin",
    title: "Bitcoin",
  },
  {
    tag: "ethereum",
    title: "Ethereum",
  },
  {
    tag: "polygon",
    title: "Polygon",
  },
  {
    tag: "lens",
    title: "Lens",
  },
  {
    tag: "aave",
    title: "Aave",
  },
  {
    tag: "politics",
    title: "Politics",
  },
  {
    tag: "economics",
    title: "Economics",
  },
  {
    tag: "anime-manga",
    title: "Anime / Manga",
  },
  {
    tag: "gaming",
    title: "Gaming",
  },
  {
    tag: "sports",
    title: "Sports",
  },
  {
    tag: "superheros",
    title: "Superheros",
  },
  {
    tag: "tv-movies",
    title: "TV / Movies",
  },
  {
    tag: "random",
    title: "Random",
  },
];

export const AllCategories = [...SpecialCategories, ...DefaultCategories];

export const findCategoryForTag = (tag: string): Category | undefined => {
  return AllCategories.find((category) => tag === category.tag);
};

export const isTagSpecialCategory = (tag?: string): tag is SpecialCategoryTags => {
  return SpecialCategories.find((category) => tag === category.tag) !== undefined;
};

export const isTagNotSpecialCategory = (tag: string): boolean => {
  return !isTagSpecialCategory(tag);
};

export const tagToGQL = (tag: string): string => {
  return tag.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};
