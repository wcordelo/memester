import { Helmet } from "react-helmet-async";
import { useTitle } from "react-use";

import Footer from "../components/theme/Footer";
import Sleepy from "../components/theme/Sleepy";
import { PaddedWrapper, PageWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";

function NotFound(): JSX.Element {
  useTitle(`404 Not Found ${SUBTITLE}`);

  return (
    <PageWrapper>
      <PaddedWrapper>
        <Sleepy title={"Nothing to see here. Have you come to the right place?"} />
      </PaddedWrapper>
      <PaddedWrapper>
        <Footer />
      </PaddedWrapper>
      <Helmet>
        <meta property="og:title" content="memester - Not Found" />
        <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
      </Helmet>
    </PageWrapper>
  );
}

export default NotFound;
