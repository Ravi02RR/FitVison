import { Navigate } from 'react-router-dom';

const PublicRoute = ({ user, children }) => {
  if (user) {
    // If user is signed in, redirect to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;