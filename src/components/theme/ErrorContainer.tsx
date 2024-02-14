import styled from "styled-components";

import { MetamaskError } from "../../types/error";

export interface ErrorContainerProps {
  error?: Error | null;
}

const ErrorContainerWrapper = styled.div`
  display: block;
  flex-direction: column;
  background: #dc3545;
  border-radius: 24px;
  padding: 24px;
  margin: 24px 0;
  color: white;
`;

function ErrorContainer({ error }: ErrorContainerProps): JSX.Element {
  return error ? (
    <ErrorContainerWrapper>
      Error: {((error as MetamaskError)?.reason || error?.message) ?? "Unkown error occured."}
    </ErrorContainerWrapper>
  ) : (
    <></>
  );
}

export default ErrorContainer;
