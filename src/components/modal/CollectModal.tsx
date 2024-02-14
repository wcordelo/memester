import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount, useBalance, useSendTransaction, useWaitForTransaction } from "wagmi";

import { useApprovedModuleAllowanceAmount, useModuleCurrencyApprovalData } from "../../hooks/api/collect";
import { CollectModuleResponse } from "../../types/lens";
import { collectModuleTypeToName } from "../../types/modules";
import Button from "../theme/Button";
import Modal, { ModalProps } from "./Modal";

const CollectWrapper = styled.div`
  width: 50%;
  max-width: 50%;
  max-height: 80%;
  padding: 24px;
  background: ${(props) => props.theme.backgroundWrapper};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  border-radius: 24px;
`;

const CollectHeader = styled.h1`
  font-weight: 900;
  font-size: 24px;
  line-height: 40px;
  margin: 0;
  margin-bottom: 12px;
`;

const CollectAmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
`;

const CollectAmount = styled.p`
  margin-bottom: 16px;
`;

const CollectInformation = styled.p`
  font-size: 14px;
  margin: 0;
  margin-bottom: 24px;
  width: 100%;
`;

interface CollectModalProps extends ModalProps {
  collectSettings: CollectModuleResponse;
  collect: () => void;
  collectLoading: boolean;
  memeTitle: string;
}

function CollectModal({
  isOpen,
  onClose,
  collectSettings,
  collect,
  collectLoading,
  memeTitle,
}: CollectModalProps): JSX.Element {
  const [collectButtonText, setCollectButtonText] = useState<string | undefined>(undefined);

  const { data: approvedModuleAllowanceAmount, refetch } = useApprovedModuleAllowanceAmount();

  const { address } = useAccount();
  const { data: balance } = useBalance({ address, token: import.meta.env.VITE_COLLECT_FEE_CURRENCY });

  useEffect(() => {
    if (approvedModuleAllowanceAmount && collectSettings.amount?.value) {
      const foundModule = approvedModuleAllowanceAmount.approvedModuleAllowanceAmount.filter(
        (module) => module.module === "MultirecipientFeeCollectModule",
      )[0];

      if (foundModule && balance?.value) {
        if (balance.value.lt(parseUnits(collectSettings.amount.value, collectSettings.amount.asset.decimals))) {
          setCollectButtonText("Insufficient Balance");
        } else if (
          BigNumber.from(foundModule.allowance).lt(
            parseUnits(collectSettings.amount.value, collectSettings.amount.asset.decimals),
          )
        ) {
          setCollectButtonText("Approve WMATIC");
        } else {
          setCollectButtonText("Collect");
        }
      }
    }
  }, [approvedModuleAllowanceAmount, collectSettings, balance]);

  const { data: moduleCurrencyApprovalData } = useModuleCurrencyApprovalData();

  const {
    sendTransaction,
    isLoading: approvalLoading,
    data: sendTxData,
  } = useSendTransaction({
    mode: "recklesslyUnprepared",
    request: {
      data: moduleCurrencyApprovalData?.generateModuleCurrencyApprovalData.data,
      to: moduleCurrencyApprovalData?.generateModuleCurrencyApprovalData.to,
    },
  });

  const { data: txReceipt, isLoading: waitingLoading } = useWaitForTransaction({
    confirmations: 2,
    hash: sendTxData?.hash,
  });

  useEffect(() => {
    if (txReceipt) {
      refetch().catch(console.error);
    }
  }, [txReceipt]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CollectWrapper>
        <CollectHeader>
          {collectModuleTypeToName(collectSettings.type)}: {memeTitle}
        </CollectHeader>
        <CollectAmountWrapper>
          <CollectAmount>
            {collectSettings.amount?.value} {collectSettings.amount?.asset.name}
          </CollectAmount>

          <CollectInformation>
            Collecting allows you to support the meme creator and the memester platform.
          </CollectInformation>
          <Button
            variant="colored"
            loading={
              !collectButtonText || approvalLoading || (waitingLoading && !!sendTxData && !txReceipt) || collectLoading
            }
            disabled={
              !collectButtonText ||
              approvalLoading ||
              (waitingLoading && !!sendTxData && !txReceipt) ||
              collectLoading ||
              collectButtonText === "Insufficient Balance"
            }
            onClick={() => {
              if (collectButtonText === "Collect") {
                collect();
              } else if (collectButtonText === "Approve WMATIC") {
                sendTransaction();
              }
            }}>
            {collectButtonText}
          </Button>
        </CollectAmountWrapper>
      </CollectWrapper>
    </Modal>
  );
}

export default CollectModal;
