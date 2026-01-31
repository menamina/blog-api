import { useState, useEffect } from "react";
import Nav from "./components/nav";
import SideBar from "./components/sidebar";
import { Outlet } from "react-router";
import "../css/app.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [postOpen, setPostOpen] = useState(null);
  const [user, setUser] = useState(null);
  const [postErr, setPostErr] = useState(null);

  useEffect(() => {
    async function verifyUser() {
      try {
        let res = await fetch("http://localhost:5555/api/whoAmINow", {
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          const refreshRes = await fetch("http://localhost:5555/api/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            res = await fetch("http://localhost:5555/api/whoAmINow", {
              credentials: "include",
            });
          }
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch {
        setUser(null);
      }
    }
    verifyUser();
  }, []);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch("http://localhost:5555/");
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
          context={{
            posts,
            setPosts,
            postOpen,
            setPostOpen,
            postErr,
            user,
            setUser,
          }}
        ></Outlet>
      </div>
    </div>
  );
}

export default App;
