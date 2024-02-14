import { AllCategories } from "../../../types/categories";
import ListContainer from "../ListContainer";

const list = AllCategories.map((category) => {
  return {
    title: category.title,
    href: `/category/${category.tag}`,
    tag: category.tag,
    image: new URL(`../../../assets/categories/${category.tag}.svg`, import.meta.url).href,
  };
});

function PopularCategories(): JSX.Element {
  return <ListContainer title="Popular Categories" items={list} />;
}

export default PopularCategories;
