import { useState, useEffect } from "react";
import Nav from "./nav";
import SideBar from "./sidebar";
import Main from "./main";
import { Outlet } from "react-router";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [userVerify, setUserVerify] = useState(null);

  useEffect(() => {
    async function verifyUser() {}
    verifyUser();
  }, []);

  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5555/blog");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      } else {
        const postsAndComments = await res.json();
        setPosts(postsAndComments);
      }
    }
    getPosts();
  }, []);

  return (
    <div className="grandDiv">
      <Nav
        user={user}
        setUser={setUser}
        userToken={userToken}
        setToken={setToken}
      ></Nav>
      <div className="blog holder flex">
        <SideBar></SideBar>
        <Outlet context={{ posts, setPosts, userToken }}>
          <Main></Main>
        </Outlet>
      </div>
    </div>
  );
}

export default App;
