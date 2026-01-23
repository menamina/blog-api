import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AddPost() {
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [image, setImage] = useState(null);
  async function handleSubmit(e) {
    const action = e.nativeEvent.submitter.value;

    if (action === "draft") {
      const res = await fetch("http://localhost:5555/", {
        method: "POST",
        credentials: "include",
        body: {
          title: title,
          body: body,
          img: image,
        },
      });
      const data = res.json();
      if (!res.ok) {
        console.log(data.error);
      }
    } else if (action === "post") {
      const res = await fetch("http://localhost:5555/", {
        method: "POST",
        credentials: "include",
        body: {
          title: title,
          body: body,
          img: image,
          published: true,
        },
      });
      const data = res.json();
      if (!res.ok) {
        console.log(data.error);
      }
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            value={image}
            onChange={(e) => setImage(e.target.value)}
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
    </div>
  );
}

export default AddPost;
