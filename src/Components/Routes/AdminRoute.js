import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import get from "lodash/get";
import { getAdminByToken } from "../../API/Login";

const AdminRoute = (props) => {
    const { children, user, loading, ...rest } = props;
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [notFound, setNotFound] = React.useState(<span>Redirecting...</span>);

    React.useEffect(() => {
        const token = get(user, "token", undefined);
        if (token) {
            getAdminByToken(token)
                .then(({ data }) => {
                    console.log(data);
                    setIsLoaded(true);
                })
                .catch((e) => {
                    console.log(e);
                    setIsLoaded(false);
                });
        }
        setTimeout(() => setNotFound(<h1>Page Not Found</h1>), 5000);
    }, [user]);

    return isLoaded ? <Route {...rest} /> : loading ? <></> : notFound;
};

AdminRoute.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.loading,
});

export default connect(mapStateToProps, null)(AdminRoute);
