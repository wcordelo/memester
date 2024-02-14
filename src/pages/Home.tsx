import { Helmet } from "react-helmet-async";
import { useTitle } from "react-use";

import Hero from "../components/home/Hero";
import HomeFeed from "../components/home/HomeFeed";
import { PageWrapper } from "../components/theme/Theme";
import { TITLE } from "../constants";

function Home(): JSX.Element {
  useTitle(TITLE);

  return (
    <PageWrapper>
      <Hero />
      <HomeFeed />
      <Helmet>
        <meta property="og:title" content="memester" />
        <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
      </Helmet>
    </PageWrapper>
  );
}

export default Home;
