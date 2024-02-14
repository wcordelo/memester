import { faDiscord, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

import { ReactComponent as LensterLogo } from "../../assets/lenster.svg";
import { ReactComponent as MoonIcon } from "../../assets/moon.svg";
import { ReactComponent as SunIcon } from "../../assets/sun.svg";
import useThemeModeStore from "../../state/theme";
import { ButtonLink } from "./Theme";

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SocialContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  p {
    margin-top: 8px;
    margin-bottom: 8px;
  }
`;

const SocialLink = styled.a`
  color: black;
  font-size: 20px;
  margin-right: 10px;

  :visited {
    color: black;
  }
`;

const DividerText = styled.p`
  margin-left: 7.5px;
  font-weight: 800;
`;

const CopyrightText = styled.p`
  margin-left: 12.5px;
  font-weight: 800;
  font-size: 14px;
`;

const LegalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  margin-bottom: 8px;

  a {
    margin: 8px;
    font-weight: 800;
  }
`;

const ModeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  margin-bottom: 8px;
`;

const ModeButton = styled.button<ButtonHTMLAttributes<HTMLButtonElement>>`
  background-color: transparent;
  border: none;
  cursor: pointer;

  :disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    filter: drop-shadow(0px 0px 2px ${(props) => props.theme.shadowColor});
  }

  &:active:not(:disabled) {
    filter: drop-shadow(0 0 0 ${(props) => props.theme.shadowColor});
  }
`;

function Footer(): JSX.Element {
  const { mode, toggleMode } = useThemeModeStore();

  return (
    <FooterWrapper>
      <SocialContainerWrapper>
        <SocialLink href="https://lenster.xyz/u/memester-xyz.lens" target={"_blank"}>
          <LensterLogo />
        </SocialLink>
        <SocialLink href="https://twitter.com/memester_xyz" target={"_blank"}>
          <FontAwesomeIcon icon={faTwitter} />
        </SocialLink>
        <SocialLink href="https://discord.gg/memester-xyz" target={"_blank"}>
          <FontAwesomeIcon icon={faDiscord} />
        </SocialLink>
        <SocialLink href="https://github.com/memester-xyz" target={"_blank"}>
          <FontAwesomeIcon icon={faGithub} />
        </SocialLink>
        <DividerText>|</DividerText>
        <CopyrightText>© {new Date().getFullYear()} memester</CopyrightText>
      </SocialContainerWrapper>
      <LegalWrapper>
        <ButtonLink to="/policy/privacy-policy">Privacy Policy</ButtonLink>
        <ButtonLink to="/policy/terms-of-service">Terms of Service</ButtonLink>
      </LegalWrapper>
      <ModeWrapper>
        <ModeButton onClick={() => toggleMode()}>{mode === "light" ? <SunIcon /> : <MoonIcon />}</ModeButton>
      </ModeWrapper>
    </FooterWrapper>
  );
}

export default Footer;
