import { Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  return (
    <div class="Login">
      <div>
        <div>
          <label>email:</label>
          <input name="email"></input>
        </div>
        <div>
          <label>name:</label>
          <input name="name"></input>
        </div>
        <div>
          <label>password:</label>
          <input name="password"></input>
        </div>
        <div>
          <label>confirm password:</label>
          <input name="password"></input>
        </div>
        <div>
          <button>signup</button>
        </div>
      </div>

      <div>
        <div>Already have an account?</div>
        <div>
          <Link to="/login">login</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
