import { useState, useEffect } from "react";
import { Outlet } from "react-router";

function App() {
  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5555/dashBoard");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      } else {
        const postsAndComments = await res.json();
        return postsAndComments;
      }
    }
    getPosts();
  }, [isAdmin]);
}

export default App;
