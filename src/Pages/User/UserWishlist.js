import React from "react";
import PropTypes from "prop-types";
import SideNav from "../../Components/Nav/SideNav";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../enums";

const UserWishlist = (props) => {
    const { setSideNav, setHeader } = props;

    React.useEffect(() => {
        const path = window.location.pathname;
        setSideNav(Object.keys(URLS).find((key) => URLS[key] === path) || "");
        setHeader("USER_HISTORY");
    }, [setSideNav, setHeader]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">WISHLIST PAGE</div>
            </div>
        </div>
    );
};

UserWishlist.propTypes = {
    setSideNav: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setSideNav: (nav) =>
        dispatch({ type: REDUX.SET_USERSIDENAV, payload: nav }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(null, mapDispatchToProps)(UserWishlist);
