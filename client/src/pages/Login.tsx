import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import "./login.css";
const Login = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
    setFormState({
      email: "",
      password: "",
    });
  };
  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      {data ? (
        <div className="success-message">
          <p>
            Success! You may now head <Link to="/">back to the homepage.</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="form-input"
              placeholder="Your email"
              name="email"
              id="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="form-input"
              placeholder="******"
              name="password"
              id="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-success" type="submit">
            Login
          </button>
          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Sign up here!</Link>
            </p>
          </div>
        </form>
      )}
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};
export default Login;
