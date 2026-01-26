import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function EditPost({ postOpen, setPostOpen }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!postOpen || !postOpen.post) return;
    if (postOpen.post.commentsOnThisPost.length === 0) {
      setComments([]);
    } else {
      const comments = postOpen.post.commentsOnThisPost.map(
        (comment) => comment,
      );
      setComments(comments);
    }
  }, [postOpen]);

  async function updatePost(e) {
    e.preventDefault();

    try {
      const res = await fetch(
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
      setPostOpen(false);
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
      const res = await fetch(
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
        <div>No post</div>
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
            {postOpen.post.commentsOnThisPost.length === 0 ? (
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
                    <div className="COMMENT" key={comment.createdAt}>
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
