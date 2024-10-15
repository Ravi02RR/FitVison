
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/signin" />;
    }

    return user.isPro ? children : <Navigate to="/pro" />;
};

ProRoute.propTypes = {
    user: PropTypes.shape({
        isPro: PropTypes.bool
    }),
    children: PropTypes.node.isRequired
};

export default ProRoute;