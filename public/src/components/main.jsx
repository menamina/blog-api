import { useOutletContext } from "react-router-dom";

function Main() {
  const { posts } = useOutletContext;
  return <div className="main"></div>;
}

export default Main;
