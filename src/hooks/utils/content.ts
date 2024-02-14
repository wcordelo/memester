import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { isTagNotSpecialCategory } from "../../types/categories";
import {
  Metadata,
  PostMetadata,
  PublicationMainFocus,
  PublicationMetadataDisplayType,
  PublicationMetadataVersions,
} from "../../types/metadata";
import { useProfile } from "../contract/profile";

export const useMemeContent = (
  tags: string[],
  profileId: string | undefined,
  address: string | undefined,
  title: string | undefined,
  caption: string | undefined,
  share: boolean,
  memeText: string | undefined,
  imageIPFSHash?: string,
): Metadata | undefined => {
  const [content, setContent] = useState<Metadata | undefined>(undefined);
  const [publicationId, setPublicationId] = useState<string | undefined>(undefined);

  const { data } = useProfile(profileId);

  useEffect(() => {
    if (data?.pubCount && profileId) {
      const futurePost = data.pubCount.add("1").toHexString();
      setPublicationId(`${profileId}-${futurePost}`);
    }
  }, [data]);

  useEffect(() => {
    const finalTags = tags.filter(isTagNotSpecialCategory);

    // Add "random" tag if not tagged
    if (finalTags.length === 0) {
      finalTags.push("random");
    }

    // Always add "meme" tag
    if (!finalTags.includes("meme")) {
      finalTags.push("meme");
    }

    // Note: externalURL could be incorrect if the user publishes again before this one lands on-chain
    const externalURL = publicationId ? `${import.meta.env.VITE_PUBLIC_URL}/create/editor/${publicationId}` : undefined;

    if (address && memeText && title && finalTags && imageIPFSHash) {
      const image = `ipfs://${imageIPFSHash}/image.jpg`;

      let content;

      if (caption) {
        content = caption;
      }

      if (share) {
        const shareContent = externalURL
          ? `Make your own '${title}' meme at ${externalURL}`
          : `Make your own '${title}' meme at ${import.meta.env.VITE_PUBLIC_URL}`;

        if (content) {
          content += "\n\n" + shareContent;
        } else {
          content = shareContent;
        }
      }

      setContent({
        version: PublicationMetadataVersions.two,
        metadata_id: uuidv4(),
        name: title,
        content,
        description: title,
        locale: navigator.language || "en",
        tags: finalTags,
        mainContentFocus: PublicationMainFocus.IMAGE,
        external_url: externalURL,
        // TODO: Maybe add more attributes?
        attributes: [
          { displayType: PublicationMetadataDisplayType.string, traitType: "Original Poster", value: address },
          { displayType: PublicationMetadataDisplayType.string, traitType: "Meme Title", value: title },
        ],
        image,
        imageMimeType: "image/jpeg",
        media: [
          {
            item: image,
            type: "image/jpeg",
            altTag: memeText,
          },
        ],
        appId: import.meta.env.VITE_LENS_APP_ID,
      });
    } else {
      setContent(undefined);
    }
  }, [tags, address, title, memeText, imageIPFSHash]);

  return content;
};

export const useCompetitionContent = (
  address: string | undefined,
  title: string | undefined,
  description: string | undefined,
  iconIPFSHash: string | undefined,
  iconMimeType: string | undefined,
): PostMetadata | undefined => {
  const [content, setContent] = useState<Metadata | undefined>(undefined);

  useEffect(() => {
    if (address && title && description) {
      const lensContent =
        description +
        "\n\n" +
        `We are running a competition on @memester-xyz.lens! Go to ${
          import.meta.env.VITE_PUBLIC_URL
        } to submit your entry!`;

      const content: Metadata = {
        version: PublicationMetadataVersions.two,
        metadata_id: uuidv4(),
        name: title,
        content: lensContent,
        description: title,
        locale: navigator.language || "en",
        tags: ["competition"],
        mainContentFocus: PublicationMainFocus.TEXT_ONLY,
        appId: import.meta.env.VITE_LENS_COMPETITION_APP_ID,
        attributes: [],
      };

      if (iconIPFSHash && iconMimeType) {
        const image = `ipfs://${iconIPFSHash}`;

        content.mainContentFocus = PublicationMainFocus.IMAGE;
        content.image = image;
        content.imageMimeType = iconMimeType;
        content.media = [
          {
            item: image,
            type: iconMimeType,
          },
        ];
      }

      setContent(content);
    } else {
      setContent(undefined);
    }
  }, [address, title, description, iconIPFSHash, iconMimeType]);

  return content;
};

export const useCommentContent = (address?: string, comment?: string, publicationId?: string): Metadata | undefined => {
  const [content, setContent] = useState<Metadata | undefined>(undefined);

  useEffect(() => {
    if (address && publicationId && comment) {
      setContent({
        version: PublicationMetadataVersions.two,
        metadata_id: uuidv4(),
        content: comment,
        name: `A comment on post ${publicationId}`,
        locale: navigator.language || "en",
        mainContentFocus: PublicationMainFocus.TEXT_ONLY,
        attributes: [],
        appId: import.meta.env.VITE_LENS_APP_ID,
      });
    } else {
      setContent(undefined);
    }
  }, [address, comment, publicationId]);

  return content;
};

export const useMemeCompetitionContent = (
  tags: string[],
  address: string | undefined,
  title: string | undefined,
  caption: string | undefined,
  memeText: string | undefined,
  imageIPFSHash?: string,
  competitionId?: string,
): Metadata | undefined => {
  const [content, setContent] = useState<Metadata | undefined>(undefined);

  useEffect(() => {
    const finalTags = tags.filter(isTagNotSpecialCategory);

    // Add "random" tag if not tagged
    if (finalTags.length === 0) {
      finalTags.push("random");
    }

    // Always add "meme" tag
    if (!finalTags.includes("meme")) {
      finalTags.push("meme");
    }

    if (address && memeText && title && finalTags && imageIPFSHash && competitionId) {
      const image = `ipfs://${imageIPFSHash}/image.jpg`;

      let content;

      if (caption) {
        content = caption;

        content +=
          "\n\n" +
          `Submit your own meme to the competition at ${import.meta.env.VITE_PUBLIC_URL}/competition/${competitionId}`;
      }

      setContent({
        version: PublicationMetadataVersions.two,
        metadata_id: uuidv4(),
        name: title,
        content,
        description: title,
        locale: navigator.language || "en",
        tags: finalTags,
        mainContentFocus: PublicationMainFocus.IMAGE,
        attributes: [
          { displayType: PublicationMetadataDisplayType.string, traitType: "Original Poster", value: address },
          { displayType: PublicationMetadataDisplayType.string, traitType: "Meme Title", value: title },
          { displayType: PublicationMetadataDisplayType.string, traitType: "Competition", value: competitionId },
        ],
        image,
        imageMimeType: "image/jpeg",
        media: [
          {
            item: image,
            type: "image/jpeg",
            altTag: memeText,
          },
        ],
        appId: import.meta.env.VITE_LENS_APP_ID,
      });
    } else {
      setContent(undefined);
    }
  }, [tags, address, title, memeText, imageIPFSHash]);

  return content;
};
