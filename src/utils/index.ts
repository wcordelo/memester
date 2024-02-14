import { CompetitionMap, CompetitionType, FONT_SIZES } from "../constants";

export function parseIPFSURL(ipfsUrl: undefined): undefined;
export function parseIPFSURL(ipfsUrl: string): string;
export function parseIPFSURL(ipfsUrl: string | undefined): string | undefined;
export function parseIPFSURL(ipfsUrl: string | undefined): string | undefined {
  if (ipfsUrl?.startsWith("ipfs://")) {
    return `${import.meta.env.VITE_IPFS_GATEWAY_URL}${ipfsUrl?.substring(7)}`;
  } else if (ipfsUrl?.startsWith("https://lens.infura-ipfs.io/ipfs/")) {
    return `${import.meta.env.VITE_IPFS_GATEWAY_URL}${ipfsUrl?.substring(33)}`;
  } else {
    return ipfsUrl;
  }
}

export function getIdealFontSize(): number {
  let initialSize = Math.floor(window.innerWidth / 20);
  if (initialSize > 40) {
    initialSize = 40;
  }

  return closestFontSize(initialSize);
}

export function closestFontSize(size: number): number {
  return FONT_SIZES.reduce(function (prev: number, curr: number) {
    return Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev;
  });
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export function implementationContractType(implementation: string): CompetitionType {
  return CompetitionMap[implementation];
}

export async function convertBase64(file: File | undefined): Promise<string | undefined> {
  return await new Promise((resolve, reject) => {
    if (file !== undefined) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result?.toString());
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    } else {
      resolve(undefined);
    }
  });
}
