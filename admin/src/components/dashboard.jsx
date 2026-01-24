import { Link } from "react-router-dom";

function Dashboard({
  user,
  setUser,
  userNotAdmin,
  posts,
  setPosts,
  loginErr,
  errors,
  setPostOpen,
}) {
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
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postIDNum));
    } catch (error) {
      console.log(error.message || error);
    }
  }

  async function logout() {
    const res = await fetch("http://localhost:5555/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      setUser(null);
    }
  }

  async function renderPost(postID) {
    try {
      const postIDNum = Number(postID);
      const res = await fetch(`http://localhost:5555/edit-post/${postIDNum}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setPostOpen(data.post || data);
      }
    } catch (error) {
      console.log(error.message || error);
    }
  }

  const publishedPost = posts.filter((post) => post.published === true);
  const unpublishedPost = posts.filter((post) => post.published === false);

  return (
    <div>
      {loginErr ? <div>{loginErr}</div> : null}

      {userNotAdmin ? <div>{userNotAdmin}</div> : null}

      {errors ? <div>{errors}</div> : null}

      {userNotAdmin === false ? (
        <div className="adminDash">
          <div className="nav">
            <div>
              <Link to="/new-post">NEW POST</Link>
            </div>
            <div>Hi, {user.name}</div>
            <div>
              <Link to="/admin-login" onClick={logout}>
                LOGOUT
              </Link>
            </div>
          </div>
          <div className="postContain">
            {posts.length === 0 ? (
              <div>
                No posts yet. Wanna <Link to="/new-post">create one?</Link>
              </div>
            ) : (
              <div className="post">
                <div className="postHeader">
                  <div className="published">Published</div>
                </div>
                {publishedPost.length === 0 ? (
                  <div>no published posts</div>
                ) : (
                  <div className="postGrid">
                    {publishedPost.map((post) => (
                      <div key={post.id}>
                        <div className="left postDiv">
                          <img src={`/api/multerIMG/${post.img}`} alt={post.title} />
                        </div>
                        <div className="right postDiv">
                          <div>{post.createdAt}</div>
                          <div>{post.title}</div>
                          <div>{(post.body || "").slice(0, 15)}...</div>
                          <div className="line"></div>
                          <div>
                            {(post.commentsOnThisPost || []).length} comments
                          </div>
                          <div className="postActions">
                            <div onClick={() => deletePost(post.id)}>X</div>
                            <div>
                              <Link
                                to={`/edit-post/${post.id}`}
                                onClick={() => renderPost(post.id)}
                              >
                                edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="postHeader">
                  <div className="draft">Drafts</div>
                </div>
                {unpublishedPost.length === 0 ? (
                  <div>no draft posts</div>
                ) : (
                  <div className="postGrid">
                    {unpublishedPost.map((post) => (
                      <div key={post.id}>
                        <div className="left postDiv">
                          <img src={`/api/multerIMG/${post.img}`} alt={post.title} />
                        </div>
                        <div className="right postDiv">
                          <div>{post.createdAt}</div>
                          <div>{post.title}</div>
                          <div>{(post.body || "").slice(0, 15)}...</div>
                          <div className="line"></div>
                          <div>
                            {(post.commentsOnThisPost || []).length} comments
                          </div>
                          <div className="postActions">
                            <div onClick={() => deletePost(post.id)}>X</div>
                            <div>
                              <Link to={`/dashboard/edit/${post.id}`}>
                                edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
