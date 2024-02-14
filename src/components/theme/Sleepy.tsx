import styled from "styled-components";

import notfound from "../../assets/404.png";
import { Title } from "./Theme";

const SleepyContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const SleepyTitle = styled(Title)`
  text-align: center;
`;

const SleepyImage = styled.img`
  max-width: 100%;
  max-height: 40vh;
`;

export interface SleepyProps {
  title: string;
}

function Sleepy({ title }: SleepyProps): JSX.Element {
  return (
    <SleepyContainer>
      <SleepyTitle>{title}</SleepyTitle>
      <SleepyImage src={notfound} />
    </SleepyContainer>
  );
}

export default Sleepy;
