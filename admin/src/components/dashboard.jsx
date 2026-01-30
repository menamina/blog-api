import { Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
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

function Dashboard() {
  const {
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    posts,
    setPosts,
    loginErr,
    setLoginErr,
    errors,
    setErrors,
    refreshPosts,
  } = useOutletContext();

  async function deletePost(postID) {
    try {
      const postIDNum = Number(postID);
      const res = await authFetch("http://localhost:5555/delete-post", {
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

  const publishedPost = posts
    ? posts.filter((post) => post.published === true)
    : [];

  const unpublishedPost = posts
    ? posts.filter((post) => post.published === false)
    : [];

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
  }, [refreshPosts]);

  return (
    <div>
      {loginErr ? <div>{loginErr}</div> : null}

      {errors ? <div>{errors}</div> : null}

      {isAdmin === true ? (
        <div className="adminDash">
          <div className="nav">
            <div>
              <Link to="/new-post">NEW POST</Link>
            </div>
            <div>Hi, {user?.name}</div>
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
                          {post.img ? (
                            <img
                              src={`http://localhost:5555/api/multerIMG/${post.img}`}
                              alt={post.title}
                            />
                          ) : (
                            <div></div>
                          )}
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
                              <Link to={`/edit-post/${post.id}`}>edit</Link>
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
                          {post.img ? (
                            <img
                              src={`http://localhost:5555/api/multerIMG/${post.img}`}
                              alt={post.title}
                            />
                          ) : (
                            <div></div>
                          )}
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
      ) : (
        <div>loading</div>
      )}
    </div>
  );
}

export default Dashboard;
