import { useState } from "react";
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
  function logout(e) {
    // async func to logout
    setUser(null);
  }
  return (
    <div>
      {loginErr ? <div>{loginErr}</div> : null}

      {userNotAdmin ? <div>{userNotAdmin}</div> : null}

      {errors ? <div>{errors}</div> : null}

      {userNotAdmin === false ? (
        <div className="adminDash">
          <div className="nav">
            <div><Link to="/new-post">NEW POST</Link></div>
            <div>Hi, {user.name}</div>
            <div><Link to="/admin-login" onClick={logout}>LOGOUT</Link></div>
          </div>
          <div className="postContain">
            {posts.length === 0 ? (
              <div>No posts yet. Wanna <Link to="/new-post">create one?</Link></div>
            ) : (
              <div className="postGrid">
                {posts.map((post) => (
                  <div key={post.id || post._id || post.title}>
                    <div className="left postDiv">
                      <img src={`api/multerIMG/${post.img}`} alt={post.title} />
                    </div>
                    <div className="right postDiv">
                      <div>{post.createdAt}</div>
                      <div>{post.title}</div>
                      <div>{(post.body || "").slice(0, 15)}...</div>
                      <div className="line"></div>
                      <div>{(post.commentsOnThisPost || []).length} comments</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
