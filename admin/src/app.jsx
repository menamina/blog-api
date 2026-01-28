import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./css/app.css";

async function authFetch(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    const refreshRes = await fetch("http://localhost:5555/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!refreshRes.ok) {
      throw new Error("Session expired");
    }
    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }
  return res;
}

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [postOpen, setPostOpen] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loginErr, setLoginErr] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await authFetch("http://localhost:5555/api/whoAmINow");

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await authFetch("http://localhost:5555/dashboard");

        if (!res.ok) {
          throw new Error("Not authorized");
        }

        const data = await res.json();
        setPosts(data);
        setIsAdmin(true);
        setLoginErr(null);
        setErrors(null);
      } catch (error) {
        setIsAdmin(false);
        setErrors("You are not authorized");
        console.log(error);
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
