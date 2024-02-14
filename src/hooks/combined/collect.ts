import { useEffect } from "react";

import { useCreateCollectTypedData } from "../api/collect";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useCollectPublication = (
  publicationId: string,
  onCompleted: () => void,
): { collect: () => void; loading: boolean; error: Error | null } => {
  const [createCollectTypedData, { data: collectTypedData }] = useCreateCollectTypedData(publicationId);

  const signReturn = useSignTypedData(collectTypedData?.createCollectTypedData?.typedData);

  const {
    start: collect,
    loading,
    error,
  } = useBroadcastAPIHook(collectTypedData?.createCollectTypedData?.id, undefined, signReturn, onCompleted);

  useEffect(() => {
    loading && createCollectTypedData().catch(console.error);
  }, [publicationId, loading]);

  return { collect, loading, error };
};
