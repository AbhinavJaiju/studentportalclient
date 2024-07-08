import React from "react";
import axios from "axios";
import { useState } from "react";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../lib/customHooks";
import { storeTokenInLocalStorage } from "../lib/common";
import "../styles/signin.css";

const SignIn = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  const [error, setError] = useState();
  // if (user || authenticated) {
  //   navigate(APP_ROUTES.DASHBOARD)
  // }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: "post",
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password,
        },
      });
      console.log(response.status);
      if (response.status === 400) {
        setError(response.data.msg);
      }
      if (!response?.data?.token) {
        console.log("Something went wrong during signing in: ", response);
        return;
      }
      storeTokenInLocalStorage(response.data.token);
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err) {
      console.log("Some error occured during signing in: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="sign-in-container">
      <div className="sign-in-box">
        <h2>Sign in</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signIn}>
            {isLoading ? (
              <div className="loading-spinner" />
            ) : null}
            <span>SIGN IN</span>
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="admin-link">
          Log in as Admin?
          <Link to="/admin">
            <button className="minimal-button">Admin</button>
          </Link>
        </div>
      </div>
  </div>
  );
};

export default SignIn;
