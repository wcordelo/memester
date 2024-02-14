import { useAccount } from "wagmi";

import { useAuth } from "../../context/AuthContext";
import { useDefaultProfile } from "../../hooks/api/profile";
import { isTagSpecialCategory, SpecialCategoryTagToSortCriteria } from "../../types/categories";
import GenericTimeline from "../category/GenericTimeline";
import Feed from "../theme/Feed";

export type FeedProps = React.HTMLAttributes<HTMLDivElement> & {
  tag?: string;
  competitionId?: string;
  publicationId?: string;
};

function HomeFeed({ tag, competitionId, publicationId }: FeedProps): JSX.Element {
  const { address } = useAccount();

  const { defaultProfile } = useDefaultProfile(address);
  const { isAuthenticated } = useAuth(address);

  const defaultProps = { profileId: defaultProfile?.id };

  return (
    <Feed>
      {tag ? (
        isTagSpecialCategory(tag) ? (
          <GenericTimeline
            {...defaultProps}
            timelineType={"special"}
            tags={[tag]}
            errorMessage={`No ${tag} memes found`}
            sortCriteria={SpecialCategoryTagToSortCriteria[tag]}
          />
        ) : (
          <GenericTimeline
            {...defaultProps}
            tags={[tag]}
            timelineType={"tagged"}
            errorMessage={`No memes found for category: ${tag}`}
          />
        )
      ) : publicationId ? (
        <GenericTimeline
          {...defaultProps}
          competitionId={competitionId}
          publicationId={publicationId}
          timelineType={"competition"}
          errorMessage={`No competition entries yet.`}
        />
      ) : defaultProfile?.id && isAuthenticated ? (
        <GenericTimeline
          {...defaultProps}
          timelineType={"profile"}
          errorMessage={
            "Nothing on your Timeline! We recommend following some people or checking out the Top categories."
          }
        />
      ) : (
        <GenericTimeline
          {...defaultProps}
          timelineType={"special"}
          tags={["latest"]}
          errorMessage={"No latest memes found"}
          sortCriteria={SpecialCategoryTagToSortCriteria.latest}
        />
      )}
    </Feed>
  );
}

export default HomeFeed;
