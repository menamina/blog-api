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
  return (
    <div className="nav">
      <div>BLOG</div>

      <div>
        <div>ECLECTIC,</div>
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
