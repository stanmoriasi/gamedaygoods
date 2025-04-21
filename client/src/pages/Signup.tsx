import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import "./signup.css";
const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      {data ? (
        <div className="success-message">
          <p>
            Success! You may now head <Link to="/">back to the homepage.</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              className="form-input"
              placeholder="Your username"
              name="username"
              id="username"
              type="text"
              value={formState.username}
              onChange={handleChange}
              required
            />
          </div>
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
            Create Account
          </button>
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Log in here!</Link>
            </p>
          </div>
        </form>
      )}
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};
export default Signup;
