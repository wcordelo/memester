import { gql, MutationTuple, QueryResult, useMutation, useQuery } from "@apollo/client";

import { TypedDataResponse } from "../../types/lens";

interface CollectRequest {
  request: {
    publicationId?: string;
  };
}

// more: https://docs.lens.xyz/docs/create-collected-typed-data
interface CollectResponse {
  createCollectTypedData: TypedDataResponse;
}

const COLLECT = gql`
  mutation ($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;

export const useCreateCollectTypedData = (publicationId?: string): MutationTuple<CollectResponse, CollectRequest> => {
  return useMutation<CollectResponse, CollectRequest>(COLLECT, {
    variables: {
      request: {
        publicationId,
      },
    },
  });
};

// more: https://docs.lens.xyz/docs/approved-allowance-of-modules
interface ApprovedModuleAllowanceAmountResponse {
  approvedModuleAllowanceAmount: Array<{
    currency: string;
    module: string;
    contractAddress: string;
    allowance: string;
  }>;
}

const APPROVED_MODULE_ALLOWANCE_AMOUNT = gql`
  query ApprovedModuleAllowanceAmount($request: ApprovedModuleAllowanceAmountRequest!) {
    approvedModuleAllowanceAmount(request: $request) {
      currency
      module
      contractAddress
      allowance
    }
  }
`;

export const useApprovedModuleAllowanceAmount = (): QueryResult<ApprovedModuleAllowanceAmountResponse> => {
  return useQuery<ApprovedModuleAllowanceAmountResponse>(APPROVED_MODULE_ALLOWANCE_AMOUNT, {
    variables: {
      request: {
        currencies: [import.meta.env.VITE_COLLECT_FEE_CURRENCY],
        collectModules: ["MultirecipientFeeCollectModule"],
      },
    },
  });
};

// more: https://docs.lens.xyz/docs/generate-module-currency-approval-data
interface ModuleCurrencyApprovalDataResponse {
  generateModuleCurrencyApprovalData: {
    to: string;
    from: string;
    data: string;
  };
}

const MODULE_CURRENCY_APPROVAL_DATA = gql`
  query GenerateModuleCurrencyApprovalData($request: GenerateModuleCurrencyApprovalDataRequest!) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }
`;

export const useModuleCurrencyApprovalData = (): QueryResult<ModuleCurrencyApprovalDataResponse> => {
  return useQuery<ModuleCurrencyApprovalDataResponse>(MODULE_CURRENCY_APPROVAL_DATA, {
    variables: {
      request: {
        currency: import.meta.env.VITE_COLLECT_FEE_CURRENCY,
        collectModule: "MultirecipientFeeCollectModule",
        value: Number.MAX_SAFE_INTEGER.toString(),
      },
    },
  });
};
