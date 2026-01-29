import { Link } from "react-router-dom";
import "../../css/app.css";

function Nav({ user, setUser }) {
  async function handleLogout() {
    await fetch("http://localhost:5555/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }

  function closePost(setPostOpen) {
    setPostOpen(null);
  }

  return (
    <div className="nav">
      <div>
        <Link className="backHome" to="/" onClick={closePost}>
          BLOG
        </Link>
      </div>

      <div>
        <div className="eclectic">ECLECTIC,</div>
        <div>the dev</div>
      </div>

      <div>
        {user ? (
          <div className="logout hidden" onClick={handleLogout}>
            LOGOUT
          </div>
        ) : (
          <div className="loginSignup hidden">
            <Link to="/login">LOGIN</Link>
            <div>/</div>
            <Link to="/signup">SIGNUP</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
