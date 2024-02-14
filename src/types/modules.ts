export interface CollectModule {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export interface ReferenceModule {
  followerOnlyReferenceModule: boolean;
}

export type CollectModuleTypes = "FreeCollectModule" | "MultirecipientFeeCollectModule";

export function collectModuleTypeToName(type: CollectModuleTypes): string {
  switch (type) {
    case "FreeCollectModule":
      return "Free Collect";
    case "MultirecipientFeeCollectModule":
      return "Fee Collect";
  }
}
