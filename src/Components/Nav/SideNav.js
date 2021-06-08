import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { URLS } from "../../enums";
import { connect } from "react-redux";
import get from "lodash/get";

const SideNav = (props) => {
    const { sideNav, user } = props;
    const navItems = get(user, "role.dashboard_items", []);

    return (
        <nav>
            <ul className="nav flex-column">
                {navItems.map((item) => (
                    <li className="nav-item" key={item.value}>
                        <Link
                            name={item.value}
                            to={get(URLS, item.value)}
                            className={
                                sideNav === item.value
                                    ? "nav-link"
                                    : "nav-link disabled"
                            }
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

SideNav.propTypes = {
    sideNav: PropTypes.string.isRequired,
    user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    sideNav: state.active_side_nav,
    user: state.user,
});

export default connect(mapStateToProps)(SideNav);
