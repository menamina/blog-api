import { Link } from "react-router-dom";

function Dashboard({
  user,
  setUser,
  userNotAdmin,
  posts,
  setPosts,
  loginErr,
  errors,
}) {
  const deletePost = () => {};
  const openPost = () => {};

  function logout() {
    // async func to logout
    setUser(null);
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
                          <img
                            src={`api/multerIMG/${post.img}`}
                            alt={post.title}
                          />
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
                            <div onClick={deletePost}>X</div>
                            <div onClick={openPost}>
                              <Link to="">edit</Link>
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
                          <img
                            src={`api/multerIMG/${post.img}`}
                            alt={post.title}
                          />
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
                            <div onClick={deletePost}>X</div>
                            <div onClick={openPost}>
                              <Link to="">edit</Link>
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
