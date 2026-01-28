import { Link, useOutletContext } from "react-router-dom";

function Main() {
  const { posts, postOpen, setPostOpen, user } = useOutletContext();
  function openPost(e) {
    const postID = e.currentTarget.dataset.id;
    const post = posts.find((post) => post.id === Number(postID));
    setPostOpen(post);
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
                    <div>
                      <input placeholder="Write a comment.."></input>
                      <button>cancel</button>
                      <button>post</button>
                    </div>
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
                      <div className="COMMENT" key={comment.createdAt}>
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
          <div className="postDiv flex" onClick={openPost(e)} data-id={post.id}>
            <div className="left postDiv">
              <img
                src={`http://localhost:5555/api/multerIMG/${post.img}`}
                alt={post.title}
              />
            </div>
            <div className="right postDiv">
              <div>{post.createdAt}</div>
              <div>{post.title}</div>
              <div>{post.body.splice(0, 15)}...</div>
              <div className="line"></div>
              <div>
                <div>{post.commentsOnThisPost.length} comments</div>
              </div>
            </div>
          </div>;
        })
      )}
    </div>
  );
}

export default Main;
