import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import get from "lodash/get";

const PrivateRoute = (props) => {
    const { children, user, loading, ...rest } = props;
    const isLoggedIn = Boolean(get(user, "token", ""));
    return isLoggedIn || loading ? (
        <Route {...rest} />
    ) : (
        <h1>NOT FOUND!!</h1>
    );
};

PrivateRoute.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.loading,
});

export default connect(mapStateToProps, null)(PrivateRoute);
