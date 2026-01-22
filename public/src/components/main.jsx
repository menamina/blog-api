import { useOutletContext } from "react-router-dom";

function Main() {
  const { posts, postOpen, setPostOpen, user } = useOutletContext;
  function openPost(e){
    const postID = e.currentTarget.dataset.id;
    const post = posts.find((post) => post.id === Number(postID));
    setPostOpen(post);

  }

  return (
    <div className="main">
      { postOpen ? 
      <div className="openPost">
        

      </div>

      : {posts.map((post) => {
        <div className="postDiv flex" onClick={openPost(e)} data-id={post.id}>
          <div className="left postDiv">
            <image src=""></image>
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
      })}
      }

      
    </div>
  );
}

export default Main;
