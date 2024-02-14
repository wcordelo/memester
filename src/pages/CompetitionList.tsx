import Header from "../components/category/Header";
import MemeCompetitionsList from "../components/theme/sidebars/MemeCompetitionsList";
import { PaddedWrapper, PageWrapper } from "../components/theme/Theme";

function CompetitionList(): JSX.Element {
  return (
    <PageWrapper>
      <Header supertitle="Every meme competition on Memester" title="All Competitions" />
      <PaddedWrapper transparent>
        <MemeCompetitionsList showAll hideListLink />
      </PaddedWrapper>
    </PageWrapper>
  );
}

export default CompetitionList;
