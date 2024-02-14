import styled from "styled-components";
import { useNetwork } from "wagmi";

export interface SuccessContainerProps {
  hash?: string;
}

const SuccessContainerWrapper = styled.div`
  display: block;
  background: #28a745;
  border-radius: 24px;
  padding: 24px;
  margin: 24px 0;
  color: white;

  a {
    color: white;
    display: inline;
  }

  a :visited {
    color: white;
  }
`;

function SuccessContainer({ hash }: SuccessContainerProps): JSX.Element {
  const { chain } = useNetwork();

  return hash ? (
    <SuccessContainerWrapper>
      <>
        Success: transaction confirmed{" "}
        {chain?.blockExplorers ? (
          <a href={`${chain.blockExplorers.default.url}/tx/${hash}`} target="_blank" rel="noreferrer">
            {hash}
          </a>
        ) : (
          { hash }
        )}
      </>
    </SuccessContainerWrapper>
  ) : (
    <></>
  );
}

export default SuccessContainer;
