import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import "../css/app.css";

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

function AddPost() {
  const navigate = useNavigate();
  const { setRefreshPost } = useOutletContext;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (image) formData.append("image", image);
    formData.append("published", action);

    const res = await authFetch("http://localhost:5555/new-post", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      return console.log(data.error.error);
    }
    setRefreshPost((prev) => prev + 1);
    navigate("/dashboard");
    return;
  }
  return (
    <div className="newPostDiv">
      <form className="formNewPost" onSubmit={handleSubmit}>
        <div>
          <label>title:</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div>
          <label>picture:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          ></input>
        </div>
        <div>
          <label>body</label>
          <input
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></input>
        </div>
        <div>
          <button value="draft">save draft</button>
          <button value="post">post</button>
        </div>
      </form>
      <Link to="/dashboard">cancel</Link>
    </div>
  );
}

export default AddPost;
