import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

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

function EditPost() {
  const [postOpen, setPostOpen] = useState("");
  const navigate = useNavigate();
  const { postID } = useParams();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    async function renderOpenPost() {
      try {
        const res = await authFetch(
          `http://localhost:5555/edit-post/${postID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) {
          console.log("sorry");
        } else {
          setPostOpen(data);
          setTitle(data.post.title);
          setBody(data.post.body);
          setPublished(data.post.published);
          setComments(data.post.commentsOnThisPost);
        }
      } catch (error) {
        console.log("whoops", error);
      }
    }
    renderOpenPost();
  }, [postID]);

  async function updatePost(e) {
    e.preventDefault();

    try {
      const res = await authFetch(
        `http://localhost:5555/edit-post/${postOpen.post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            postID: postOpen.post.id,
            title,
            body,
            published,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        return;
      }
      setPostOpen(null);
      navigate("/dashboard");
    } catch (err) {
      console.log("error");
      console.error(err);
    }
  }

  function viewComments() {
    setShowComments(!showComments);
  }

  async function deleteComment(commentID, postID) {
    try {
      const res = await authFetch(
        "http://localhost:5555/dashboard/delete-comments",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentID: Number(commentID),
            postID: Number(postID),
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentID),
        );
      } else {
        console.log("cannot delete comment");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePost(postID) {
    try {
      const postIDNum = Number(postID);
      const res = await fetch("http://localhost:5555/dashboard/delete-post", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postID: postIDNum,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message || error);
    }
  }

  return (
    <div>
      {!postOpen ? (
        <div>Loading</div>
      ) : (
        <div>
          <div>
            <form onSubmit={updatePost}>
              <div onClick={() => deletePost(postOpen.post.id)}>X</div>
              <div>
                <label>Title:</label>
                <input
                  value={title}
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Image:</label>
                <img src={`/api/multerIMG/${postOpen.post.img}`}></img>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Body:</label>
                <input
                  value={body}
                  name="body"
                  onChange={(e) => setBody(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Published:</label>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
              </div>
              <div>
                <Link to="/dashboard">cancel</Link>
                <button type="submit">update</button>
              </div>
            </form>
          </div>
          <div>
            {comments.length === 0 ? (
              <div>no comments yet</div>
            ) : (
              <div className="showHideComm" onClick={viewComments}>
                click to view comments
              </div>
            )}
          </div>
          <div>
            {showComments ? (
              <div>
                {comments.map((comment) => {
                  return (
                    <div className="COMMENT" key={comment.id}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <div>{comment.name}</div>
                        <div>{comment.createdAt}</div>
                        <div>{comment.comment}</div>
                      </div>
                      <div
                        onClick={() =>
                          deleteComment(comment.id, postOpen.post.id)
                        }
                      >
                        X
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPost;
