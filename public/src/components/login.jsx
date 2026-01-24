import { Link } from "react-router-dom";
import { useState } from "react";

function Login({ user, setUser }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState(null);
  async function login(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErrors(data.error);
    } else {
      setUser(data);
    }
  }
  return (
    <div className="main">
      {errors ? (
        <div>
          {errors.map((error) => {
            -{ error };
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

        <button class="btn" type="submit" onClick={login}>
          LOGIN
        </button>
      </form>
      <div>
        <div>Dont have an account yet?</div>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Login;
