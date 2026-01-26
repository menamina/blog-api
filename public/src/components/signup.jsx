import { Link } from "react-router-dom";
import { useState } from "react";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [emailTaken, setEmailTaken] = useState("");

  async function signup(e) {
    e.preventDefault();
    setEmailTaken("");
    try {
      const res = await fetch("http://localhost:5555/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (res.status === 409 && data.userTaken) {
        setErrors(null);
        setEmailTaken(data.userTaken);
        return;
      }

      if (!res.ok) {
        setErrors(data.errors);
        console.log("err res.ok");
        return;
      } else {
        setErrors(null);
        data.userTaken ? setEmailTaken(data.userTaken) : null;
      }
    } catch {
      console.log("error res.ok was ok");
    }
  }
  return (
    <div className="main">
      {errors ? (
        <div>
          {errors.map((error) => {
            return <div>{error.msg}</div>;
          })}
        </div>
      ) : null}
      <form onSubmit={signup}>
        {emailTaken ? <div>{emailTaken} </div> : null}
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

        <button className="btn" type="submit">
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

export default SignUp;
