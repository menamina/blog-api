import { useOutletContext } from "react-router-dom";

function Main() {
  const { posts, user } = useOutletContext;
  return <div className="main"></div>;
}

export default Main;
