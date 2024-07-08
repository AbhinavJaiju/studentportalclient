import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../lib/customHooks';
import { storeTokenInLocalStorage } from '../lib/common';
import '../styles/signin.css'

const AdminSignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user, authenticated } = useAdmin();
    if (user || authenticated) {
      navigate(APP_ROUTES.ADMIN_DASHBOARD)
    }

    const signIn = async () => {
        try {
          setIsLoading(true);
          const response = await axios({
            method: 'post',
            url: API_ROUTES.ADMIN_SIGN_IN,
            data: {
              email,
              password
            }
          });
          if (!response?.data?.token) {
            console.log('Something went wrong during signing in: ', response);
            return;
          }
          storeTokenInLocalStorage(response.data.token);
          navigate(APP_ROUTES.ADMIN_DASHBOARD)
        }
        catch (err) {
          console.log('Some error occured during signing in: ', err);
        }
        finally {
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
          {isLoading ? <div className="loading-spinner" /> : null}
          <span>SIGN IN</span>
        </button>
      </div>
      <div className="admin-link">
        Log in as Student?
        <Link to="/signin">
          <button className="minimal-button">Student</button>
        </Link>
      </div>
    </div>
    </div>
  )
}

export default AdminSignIn