import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [postOpen, setPostOpen] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loginErr, setLoginErr] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5555/dashboard", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "you must be logged in") {
          setLoginErr("Please log in");
          return;
        } else if (
          data.error === "you are not authorized to publish blog posts"
        ) {
          setIsAdmin(false);
          setErrors(data.error);
          return;
        } else {
          setErrors("Something went wrong");
          setIsAdmin(false);
          return;
        }
      } else {
        setIsAdmin(true);
        setPosts(data);
        return;
      }
    }
    getPosts();
  }, [user]);

  return (
    <div className="grandDiv">
      <Outlet
        context={{
          user,
          setUser,
          isAdmin,
          posts,
          setPosts,
          postOpen,
          setPostOpen,
          loginErr,
          errors,
        }}
      ></Outlet>
    </div>
  );
}

export default App;
