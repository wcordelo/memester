import Button from "../Button";
import ListContainer from "../ListContainer";

function NewMemestersList(): JSX.Element {
  return (
    <ListContainer title="Top Memesters" items={[{ title: "Coming Soon", subtitle: "👀" }]}>
      <Button style={{ marginTop: "10px" }}>Coming Soon</Button>
    </ListContainer>
  );
}

export default NewMemestersList;
