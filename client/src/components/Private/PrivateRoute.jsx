import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ element: Component }) => {
    const user = useSelector((state) => state.user.user);


    return user ? <Component /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
