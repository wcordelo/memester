import { useState } from "react";
import { Parallax } from "react-scroll-parallax";
import styled from "styled-components";

import meme1 from "../../assets/memes/meme1.png";
import meme2 from "../../assets/memes/meme2.png";
import meme3 from "../../assets/memes/meme3.png";
import meme4 from "../../assets/memes/meme4.png";
import meme5 from "../../assets/memes/meme5.png";
import meme6 from "../../assets/memes/meme6.png";
import meme7 from "../../assets/memes/meme7.png";
import meme8 from "../../assets/memes/meme8.png";
import meme9 from "../../assets/memes/meme9.png";
import watch from "../../assets/watch.png";
import { device } from "../../utils/breakpoints";
import VideoModal from "../modal/VideoModal";
import Button from "../theme/Button";
import { ButtonLink } from "../theme/Theme";

const HeroWrapper = styled.div`
  width: 100%;
  height: 424px;
  box-shadow: 0px -32px 48px -16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media ${device.mobileL} {
    height: 524px;
  }

  @media ${device.tabletS} {
    justify-content: start;
  }
`;

const HeroContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px 40px 40px;
  min-width: 545px;
  z-index: 2;

  @media ${device.tabletS} {
    min-width: calc(100% - 20px);
    padding: 20px 10px 10px 10px;
  }
`;

const HeroContentTitle = styled.h2`
  font-weight: 900;
  font-size: 64px;
  line-height: 72px;
  color: ${(props) => props.theme.textColor};
  margin: 25px 0 10px 0;
`;

const HeroContentSubtitle = styled.h4`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 25px;
`;

const HeroButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const HiddenMemester = styled.p`
  font-weight: 900;
  font-size: 32px;
  line-height: 48px;
  background: linear-gradient(90.07deg, #2fb8d4 0.07%, #294bff 77.14%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin: 0 0 10px 0;

  display: none;
  @media ${device.mobileL} {
    display: inline;
  }

  span {
    font-size: 12px;
    margin-left: -4px;
  }
`;

const MemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-width: 500px;
  max-width: 500px;
  margin-left: 150px;
  margin-top: 100px;
  transform: rotate(20deg);
  max-height: 800px;

  img {
    width: 146px;
    padding: 10px;
    z-index: 0;
  }
  img:nth-child(1) {
    margin-top: 50px;
  }
  img:nth-child(4) {
    margin-top: -20px;
  }

  img:nth-child(7) {
    margin-top: 20px;
  }

  @media ${device.desktopS} {
    min-width: 300px;
    margin-left: 25px;
  }

  @media ${device.tabletL} {
    min-width: 150px;
    margin-left: -50px;
  }

  @media ${device.tabletS} {
    filter: blur(2px) brightness(0.85);
    z-index: -1;
    margin-top: 70px;
    max-height: 600px;
    transform: rotate(20deg) translate(-120px, 80px);
    opacity: 0.45;
    min-width: 310px;

    img {
      width: 110px;
      padding: 10px;
      z-index: 0;
      margin-top: 0px !important;
    }
  }
`;

const ButtonImage = styled.img`
  float: left;
  padding-right: 8px;
  margin-left: -10px;
`;

function Hero(): JSX.Element {
  const [isOpen, setOpen] = useState(false);

  return (
    <HeroWrapper>
      <HeroContentLeft>
        <HiddenMemester>
          memester <span>beta</span>
        </HiddenMemester>
        <HeroContentTitle>
          The NFT Meme
          <br /> Platform
        </HeroContentTitle>
        <HeroContentSubtitle>
          Create memes and turn them into NFTs.
          <br />
          Participate in meme competitions and win prizes.
        </HeroContentSubtitle>
        <HeroButtonsContainer>
          <ButtonLink to="/meme/create">
            <Button variant="normal" large style={{ marginRight: "10px" }}>
              Create a meme!
            </Button>
          </ButtonLink>

          <Button
            variant="white"
            large
            onClick={() => {
              setOpen(true);
            }}>
            <ButtonImage src={watch} />
            Watch a 45-sec Intro
          </Button>
        </HeroButtonsContainer>
      </HeroContentLeft>
      <Parallax speed={30}>
        <MemeContainer>
          <img src={meme1} />
          <img src={meme2} />
          <img src={meme3} />
          <img src={meme4} />
          <img src={meme5} />
          <img src={meme6} />
          <img src={meme7} />
          <img src={meme8} />
          <img src={meme9} />
        </MemeContainer>
      </Parallax>
      <VideoModal
        isOpen={isOpen}
        onClose={() => {
          setOpen(false);
        }}
        src="https://lens.infura-ipfs.io/ipfs/bafybeidqcdp6lzubuomi4bgghezphdjymxho43znvgtq3ajh32jmulhsre"
        poster="https://ik.imagekit.io/lenstubeik/tr:n-thumbnail/https://lens.infura-ipfs.io/ipfs/bafybeic2rmc5xbstlvdkwmadxvxf4cr2humnt6zbz2k5amahiqmcomgk5a"
      />
    </HeroWrapper>
  );
}

export default Hero;
