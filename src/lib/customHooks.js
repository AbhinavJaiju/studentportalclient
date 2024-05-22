
import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';
import { APP_ROUTES } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export function useUser() {
  const [user, setUser] = useState([]);
  const [authenticated, setAutenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated) {
        navigate(APP_ROUTES.SIGN_IN);
        return;
      }
      // console.log(user)
      setUser(user);
      setAutenticated(authenticated);
    }
    getUserDetails();
  }, []);

  return { user, authenticated };
}
export function useAdmin(){
  const [user, setUser] = useState(null);
  const [authenticated, setAutenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAdminDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated) {
        navigate(APP_ROUTES.ADMIN_SIGN_IN);
        return;
      }
      setUser(user);
      setAutenticated(authenticated);
    }
    getAdminDetails();
  }, []);

  return { user, authenticated };
}
