import { Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");

  async function signup(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        passowrd: password,
        confirmPass: confirmPassword,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors);
      return;
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
      <form onSubmit={signup}>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Name:</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div>
          <label>Confirm Password:</label>
          <input
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="btn" type="submit" onClick={signup}>
          SIGN UP
        </button>
      </form>

      <div>
        <div>Already have an account?</div>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Login;
