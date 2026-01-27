import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "../css/app.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState(null);
  async function login(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5555/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginErrors(data.error);
    } else {
      setUser(data);
      navigate("/dashboard");
    }
  }
  return (
    <div className="main">
      {loginErrors ? (
        <div>
          {loginErrors.map((error) => {
            <div>{error}</div>;
          })}
        </div>
      ) : null}
      <form onSubmit={login}>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" type="submit">
          LOGIN
        </button>
      </form>
    </div>
  );
}

export default Login;
