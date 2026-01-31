import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";

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

function Main() {
  const { posts, setPosts, postOpen, setPostOpen, user } = useOutletContext();
  const navigate = useNavigate();
  const [postID, setpostID] = useState("");
  const [comment, setComment] = useState("");

  function openPost(e) {
    const postID = e.currentTarget.dataset.id;
    setpostID(postID);
    const post = posts.find((post) => post.id === Number(postID));
    setPostOpen(post);
  }

  function closePost() {
    setPostOpen(null);
    setpostID(null);
  }

  async function addComment(e) {
    try {
      e.preventDefault();

      console.log(postID, comment);

      const res = await authFetch("http://localhost:5555/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          postID: Number(postID),
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        try {
          const refreshed = await fetch("http://localhost:5555/");
          if (refreshed.ok) {
            const refreshedPosts = await refreshed.json();
            setPosts(refreshedPosts);
          }
        } catch (err) {
          console.log("failed to refresh posts", err);
        }

        setPostOpen(null);
        setpostID(null);
        setComment("");
        navigate("/");
      } else {
        console.log(postID);
        console.log("errrr", data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="main">
      {postOpen ? (
        <div className="openPost">
          <div>
            <div>{postOpen.createdAt}</div>
            <div>{postOpen.title}</div>
            <div>
              <img
                src={`http://localhost:5555/api/multerIMG/${postOpen.img}`}
                alt={postOpen.title}
              />
            </div>
            <div>{postOpen.body}</div>
            <div className="comments">
              <div className="commentBox">
                <div>Comments</div>
                <div className="line"></div>
                <div>
                  {user ? (
                    <form onSubmit={addComment}>
                      <div>
                        <input
                          placeholder="Write a comment.."
                          name="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></input>
                        <Link to="/" onClick={closePost}>
                          cancel
                        </Link>
                        <button>post</button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link> to comment
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="postedComments">
                {postOpen.commentsOnThisPost.length === 0
                  ? null
                  : postOpen.commentsOnThisPost.map((comment) => (
                      <div className="COMMENT" key={comment.id}>
                        <div>
                          <img src="" alt="" />
                        </div>
                        <div>
                          <div>{comment.name}</div>
                          <div>{comment.createdAt}</div>
                          <div>{comment.comment}</div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        posts.map((post) => {
          return (
            <div
              className="postDivflex"
              onClick={openPost}
              data-id={post.id}
              key={post.id}
            >
              <div className="left postDiv">
                <img
                  src={`http://localhost:5555/api/multerIMG/${post.img}`}
                  alt={post.title}
                />
              </div>
              <div className="rightpostDiv">
                <div className="postData">
                  <div className="date">{post.createdAt}</div>
                  <div className="title">{post.title}</div>
                  <div className="blurbs">{post.body.slice(0, 30)}...</div>
                </div>
                <div>
                  <div className="line"></div>
                  {post.commentsOnThisPost.length === 1 ? (
                    <div>{post.commentsOnThisPost.length} comment</div>
                  ) : (
                    <div>{post.commentsOnThisPost.length} comments</div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Main;
