import { useState, useEffect } from "react";
import Nav from "./components/nav";
import SideBar from "./components/sidebar";
import { Outlet } from "react-router";
import "../css/app.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [postErr, setPostErr] = useState(null);
  const [postOpen, setPostOpen] = useState(null);

  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await fetch("http://localhost:5555/api/whoAmINow", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const userData = await res.json();
          setUser(userData);
        }
      } catch {
        setUser(null);
      }
    }
    verifyUser();
  }, []);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch("http://localhost:5555/blog");
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        } else {
          const postsAndComments = await res.json();
          setPosts(postsAndComments);
        }
      } catch (error) {
        setPostErr("Something went wrong fetching posts");
        console.log(error);
      }
    }

    getPosts();
  }, []);

  return (
    <div className="grandDiv">
      <Nav user={user} setUser={setUser}></Nav>
      <div className="blog holder flex">
        <SideBar></SideBar>
        <Outlet
          context={{ posts, postErr, user, setUser, postOpen, setPostOpen }}
        ></Outlet>
      </div>
    </div>
  );
}

export default App;
