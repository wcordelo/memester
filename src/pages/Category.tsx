import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { useTitle } from "react-use";

import Header from "../components/category/Header";
import HomeFeed from "../components/home/HomeFeed";
import Sleepy from "../components/theme/Sleepy";
import { PageWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";
import { Category as CategoryType, findCategoryForTag } from "../types/categories";

function Category(): JSX.Element {
  const { category: categoryTag = "random" } = useParams();

  const [category, setCategory] = useState<CategoryType>({
    title: categoryTag.replace("-", " "),
    tag: categoryTag,
  });

  useEffect(() => {
    const found = findCategoryForTag(categoryTag ?? "random");

    if (found) {
      setCategory(found);
    } else {
      setCategory({
        title: categoryTag.replace("-", " "),
        tag: categoryTag,
      });
    }
  }, [categoryTag]);

  useTitle(`${category.title} Category ${SUBTITLE}`);

  return (
    <PageWrapper>
      {category ? (
        <>
          <Header supertitle={`#${category.tag}`} title={`${category.title} Memes`} />
          <HomeFeed tag={category.tag} />
          <Helmet>
            <meta property="og:title" content={`View the ${category.title} category on memester`} />
            <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
          </Helmet>
        </>
      ) : (
        <Sleepy title={`No category found!`} />
      )}
    </PageWrapper>
  );
}

export default Category;
