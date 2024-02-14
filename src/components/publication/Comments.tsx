import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import styled from "styled-components";

import { blacklist } from "../../assets/content.json";
import { usePublicationComments } from "../../hooks/api/publication";
import { parseIPFSURL } from "../../utils";
import { device } from "../../utils/breakpoints";
import ErrorContainer from "../theme/ErrorContainer";
import { ButtonLink, Title } from "../theme/Theme";
import CommentTextbox from "./CommentTextbox";

const CommentsBoxWrapper = styled.div`
  max-width: 700px;
  width: calc(100% - 60px);
  background: ${(props) => props.theme.backgroundWrapper};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  border-radius: 32px;
  padding: 30px;
  margin-bottom: 30px;

  @media ${device.tabletL} {
    width: calc(100% - 30px);
    max-height: unset;
    padding: 15px;
  }
`;

const CommentsWrapper = styled.div`
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
`;

const CommentContainer = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

const CommentHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: end;
`;

const CommentProfilePicture = styled.img`
  border-radius: 100px;
  width: 30px;
`;

const CommentCreatedAt = styled.div`
  color: ${(props) => props.theme.lightTextColor};
  flex: 1 1 50%;
  text-align: right;
`;

const CommentProfileHandle = styled.div`
  margin-left: 12px;
  color: ${(props) => props.theme.lightTextColor};
  flex: 1 1 50%;
`;

const CommentContent = styled.div`
  margin-top: 12px;
  margin-left: 42px;
  white-space: pre-line;
`;

export interface CommentsProps {
  publicationId: string;
}

function Comments({ publicationId }: CommentsProps): JSX.Element {
  const { data, error, loading, refetch } = usePublicationComments(publicationId);

  // do not allow comments on blacklisted posts
  if (blacklist.includes(publicationId)) {
    return <></>;
  }

  return (
    <CommentsBoxWrapper>
      <Title>Comments</Title>
      <CommentTextbox
        publicationId={publicationId}
        onComplete={() => {
          refetch().catch(console.error);
        }}
      />
      {data?.publications?.items && data?.publications?.items.length > 0 ? (
        <CommentsWrapper>
          {data?.publications?.items.map((item) => (
            <CommentContainer key={item.id}>
              <CommentHeader>
                <ButtonLink to={`/user/${item.profile.handle}`}>
                  <CommentProfilePicture src={parseIPFSURL(item.profile?.picture?.original?.url)} />
                </ButtonLink>
                <ButtonLink to={`/user/${item.profile.handle}`}>
                  <CommentProfileHandle>@{item.profile.handle}</CommentProfileHandle>
                </ButtonLink>
                <CommentCreatedAt
                  title={`Commented via ${item.appId ?? "unknown app"} at ${moment(item.createdAt).toLocaleString()}`}>
                  {moment(item.createdAt).fromNow()}
                </CommentCreatedAt>
              </CommentHeader>
              <CommentContent>{item.metadata.content}</CommentContent>
            </CommentContainer>
          ))}
        </CommentsWrapper>
      ) : data?.publications?.items.length === 0 ? (
        <></>
      ) : error ? (
        <ErrorContainer error={error} />
      ) : loading ? (
        // TODO: Skeleton the UI elements
        <FontAwesomeIcon icon={faSpinner} spinPulse />
      ) : (
        <ErrorContainer
          error={new Error(`No comments found for publication id: ${publicationId ?? "no publication id"}`)}
        />
      )}
    </CommentsBoxWrapper>
  );
}

export default Comments;
