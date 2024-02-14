import { useAuthenticate, useChallenge } from "@memester-xyz/lens-use";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";

import { ReactComponent as LensLogo } from "../assets/lens.svg";
import { SIGNING_REQUEST_IN_FLIGHT } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useDefaultProfile, useProfilePicture } from "../hooks/api/profile";
import { useTabFocus } from "../hooks/utils/focus";
import { useLocalStorage } from "../store";
import { device } from "../utils/breakpoints";
import Button from "./theme/Button";

const HiddenNetworkSwitcher = styled(Button)`
  @media ${device.desktopL} {
    display: none !important;
  }
`;

const ProfilePictureContainer = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 500px;
  overflow: hidden;
  margin-right: 8px;

  @media ${device.tabletM} {
    margin-right: 0;
  }
`;

const HiddenLogin = styled.span`
  margin-right: 10px;
  @media ${device.tabletS} {
    display: none;
  }
`;

const HiddenHandle = styled.span`
  @media ${device.tabletM} {
    display: none;
  }
`;

function ConnectButton(): JSX.Element {
  const tabFocused = useTabFocus();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { address } = useAccount();

  const { isAuthenticated, setAuthTokens } = useAuth(address);

  // TODO: If not profile or default profile, we should tell them they need to get a lens handle
  const defaultProfile = useDefaultProfile(address);
  const pfpURL = useProfilePicture(defaultProfile);

  const { data: challengeData } = useChallenge(address);

  const [signing, setSigning] = useLocalStorage(SIGNING_REQUEST_IN_FLIGHT, false);
  const {
    data: signData,
    signMessage,
    status,
  } = useSignMessage({
    message: challengeData?.challenge.text,
  });

  const [authenticate, { data: authenticateData, reset }] = useAuthenticate(address, signData);

  useEffect(() => {
    reset();
  }, [address]);

  useEffect(() => {
    if (address && challengeData?.challenge.text && !isAuthenticated && !signing && tabFocused) {
      setSigning(true);
      signMessage();
    }
  }, [challengeData, isAuthenticated]);

  useEffect(() => {
    if (address && signData && challengeData?.challenge.text) {
      authenticate().catch(console.error);
    }
  }, [signData]);

  useEffect(() => {
    if (authenticateData?.authenticate) {
      setAuthTokens(authenticateData.authenticate.accessToken, authenticateData.authenticate.refreshToken);
      setSigning(false);
    }
  }, [authenticateData]);

  useEffect(() => {
    if (status === "error") {
      setSigning(false);
    }
  }, [status]);

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const mostlyReady = ready && account && chain;

        const [connected, setConnected] = useState(mostlyReady && isAuthenticated);

        useEffect(() => {
          setConnected(mostlyReady && isAuthenticated);
        }, [mostlyReady, isAuthenticated]);

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}>
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (mostlyReady && !connected && challengeData?.challenge.text) {
                        signMessage();
                      } else {
                        openConnectModal();
                      }
                    }}
                    type="button">
                    <HiddenLogin>Login</HiddenLogin>
                    <LensLogo height="20px" width="20px" />
                  </Button>
                );
              }

              if (chain?.unsupported) {
                return (
                  <Button variant="normal" onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12, height: "50px" }}>
                  {!import.meta.env.PROD && (
                    <HiddenNetworkSwitcher
                      variant="colored"
                      onClick={openChainModal}
                      style={{ display: "flex", alignItems: "center" }}
                      type="button">
                      {chain?.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}>
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain?.name}
                    </HiddenNetworkSwitcher>
                  )}
                  <Button
                    variant="colored"
                    // TODO: Custom account modal which has link to own profile and disconnect
                    onClick={() => {
                      if (
                        defaultProfile?.defaultProfile?.handle &&
                        pathname !== `/user/${defaultProfile?.defaultProfile?.handle}`
                      ) {
                        navigate(`/user/${defaultProfile?.defaultProfile?.handle}`);
                      } else {
                        openAccountModal();
                      }
                    }}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button">
                    {pfpURL ? (
                      <ProfilePictureContainer>
                        <img
                          alt={`${defaultProfile?.defaultProfile?.handle ?? ""} Profile Picture`}
                          src={pfpURL}
                          style={{ width: 24, height: 24 }}
                        />
                      </ProfilePictureContainer>
                    ) : (
                      "🤠" // TODO: Check if there is a response here: https://github.com/rainbow-me/rainbowkit/discussions/763
                    )}
                    <HiddenHandle>
                      {defaultProfile?.defaultProfile ? defaultProfile.defaultProfile.handle : account?.displayName}
                    </HiddenHandle>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}

export default ConnectButton;
