import { useEffect, useState } from "react";

import { useStoreBlob } from "../../context/InfuraIPFSContext";
import { parseIPFSURL } from "../../utils";
import { scaleForTemplate, scaleValues } from "../../utils/resize";
import { usePublication } from "../api/publication";

const currentVersion = "1.0.0";

export interface Template {
  version: string;
  title: string;
  background: string;
  texts: TemplateText[];
}

export interface LoadedTemplate {
  background: Blob;
  backgroundHash: string;
  texts: TemplateText[];
  title: string;
}

export interface TemplateText {
  id: number;
  text: string;
  color: string;
  top: number;
  left: number;
  width: number;
  height?: number;
  shadowColor: string;
  fontSize: number;
  fontFamily: string;
  transform?: string;
}

export interface TemplateImage {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  transform?: string;
  content: string;
}

export interface TemplateTextParams {
  text: string;
  style: CSSStyleDeclaration;
}

export const useTemplateBackground = (source: string | Blob | undefined, skip?: boolean): string | undefined => {
  const [sourceBlob, setSourceBlob] = useState<Blob | undefined>();

  useEffect(() => {
    if (source instanceof Blob) {
      setSourceBlob(source);
    }
  }, [source]);

  const { pin, ipfsHash } = useStoreBlob(sourceBlob);

  useEffect(() => {
    !skip && pin?.();
  }, [pin]);

  return ipfsHash;
};

export const useTemplateTexts = (textParams: TemplateTextParams[], scale: number = 1): TemplateText[] | undefined => {
  const [templateTexts, setTemplateTexts] = useState<TemplateText[] | undefined>(undefined);

  useEffect(() => {
    if (textParams.length > 0) {
      const texts = textParams.map((textParam, i) => {
        const scaledValues = scaleForTemplate(scale, textParam.style);

        return {
          id: i,
          text: textParam.text,
          color: textParam.style.color,
          shadowColor: textParam.style.textShadow.split(" -")[0],
          fontFamily: textParam.style.fontFamily,
          transform: textParam.style.transform,
          ...scaledValues,
        };
      });
      setTemplateTexts(texts);
    } else {
      setTemplateTexts(undefined);
    }
  }, [textParams, scale]);

  return templateTexts;
};

export const useTemplateContent = (
  title: string | undefined,
  texts: TemplateText[] | undefined,
  backgroundIPFSHash: string | undefined,
  loadedBackgroundIPFSHash: string | undefined,
): Template | undefined => {
  const [template, setTemplate] = useState<Template | undefined>(undefined);

  useEffect(() => {
    let background = backgroundIPFSHash ?? loadedBackgroundIPFSHash;

    if (title && texts && texts.length > 0 && background) {
      if (!background?.startsWith("ipfs://")) {
        background = `ipfs://${background}`;
      }

      setTemplate({
        version: currentVersion,
        title,
        texts,
        background,
      });
    } else {
      setTemplate(undefined);
    }
  }, [title, texts, backgroundIPFSHash]);

  return template;
};

export const useTemplate = (
  publicationId: string | undefined,
  scaleDown: number = 1,
): [LoadedTemplate | undefined, boolean, Error | undefined] => {
  const { data, error: publicationError } = usePublication(publicationId);

  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [templateURL, setTemplateURL] = useState<string | undefined>(undefined);

  const [background, setBackground] = useState<Blob | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const [loadedTemplate, setLoadedTemplate] = useState<LoadedTemplate | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setTemplate(undefined);
    setTemplateURL(undefined);
    setBackground(undefined);
    setError(undefined);
  }, [publicationId]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    if (data) {
      if (data?.publication?.metadata.media[0] && data?.publication?.metadata.media[0].original.url) {
        setTemplateURL(data.publication.metadata.media[0].original.url.replace(/\/image\.(jpg|png)/, "/template.json"));
      } else if (data?.publication == null || data?.publication?.metadata.media.length === 0) {
        setError(new Error("No publication found."));
      }
    }
  }, [data]);

  useEffect(() => {
    setError(publicationError);
  }, [publicationError]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (templateURL) {
      (async function () {
        const response = await fetch(parseIPFSURL(templateURL));
        setTemplate(await response.json());
      })().catch((e) => {
        setError(e);
      });
    }
  }, [templateURL]);

  useEffect(() => {
    if (template?.background) {
      (async function () {
        const response = await fetch(parseIPFSURL(template?.background));
        setBackground(await response.blob());
      })().catch((e) => {
        setError(e);
      });
    }
  }, [template]);

  useEffect(() => {
    if (background && template) {
      setLoading(false);
      let texts: TemplateText[] = [];
      if (scaleDown) {
        texts = template.texts.map((text) => {
          const scaledValues = scaleValues(scaleDown, text.top, text.left, text.width, text.height, text.fontSize);

          return {
            ...text,
            top: scaledValues.top,
            left: scaledValues.left,
            width: scaledValues.width,
            height: scaledValues.height,
            fontSize: scaledValues.fontSize,
          };
        });
      }

      setLoadedTemplate({
        title: template.title,
        texts,
        background,
        backgroundHash: template?.background,
      });
    }
  }, [background, template, scaleDown]);

  return [loadedTemplate, loading, error];
};
