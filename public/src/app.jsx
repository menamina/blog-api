import { useState, useEffect } from "react";
import { Outlet } from "react-router";

function App() {
  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5555/blog");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      } else {
        const postsAndComments = await res.json();
        return postsAndComments;
      }
    }
    getPosts();
  }, []);
}

export default App;
