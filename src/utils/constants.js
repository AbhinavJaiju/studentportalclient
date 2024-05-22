
const API_URL = 'http://localhost:4000'
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/signup`,
  SIGN_IN: `${API_URL}/auth/signin`,
  GET_USER: `${API_URL}/auth/me`,
  ADMIN_SIGN_IN : `${API_URL}/auth/admin`,
  CREATE_NOTICE : `${API_URL}/notices`,
  DELETE_NOTICE : `${API_URL}/delete`,
  UPDATE_NOTICE : `${API_URL}/update`,
  CREATE_REQUEST : `${API_URL}/request`,
}

export const APP_ROUTES = {
  SIGN_UP: '/signup',
  SIGN_IN: '/signin',
  DASHBOARD: '/dashboard',
  ADMIN_SIGN_IN: '/admin',
  ADMIN_DASHBOARD:'/admin/dashboard',
}
