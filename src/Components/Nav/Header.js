import React from "react";
import { Badge, Menu } from "antd";
import {
    AppstoreOutlined,
    SettingOutlined,
    UserOutlined,
    UserAddOutlined,
    LogoutOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { REDUX, URLS } from "../../enums";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import get from "lodash/get";
import NavSearch from "./NavSearch";

const Header = (props) => {
    const { user, cart } = props;
    const dispatch = useDispatch();
    const active_header = useSelector((state) => state.active_header);
    const history = useHistory();

    const { SubMenu, Item } = Menu;

    const handleClick = ({ key }) => {
        console.log(key);
        dispatch({ type: REDUX.SET_HEADER, payload: key });
    };

    const logout = async () => {
        firebase.auth().signOut();
        dispatch({ type: REDUX.LOG_OUT });
        history.push(URLS.LOGIN);
    };

    const isLoggedIn = Boolean(user && user.token);
    let username = "";
    if (isLoggedIn) {
        username = user.email.split("@")[0];
    }

    return (
        <Menu
            onClick={handleClick}
            selectedKeys={[active_header]}
            mode="horizontal"
        >
            <Item key="HOME" icon={<AppstoreOutlined />}>
                <Link to={URLS.HOME}>Home</Link>
            </Item>
            <Item key="SHOP" icon={<ShopOutlined />}>
                <Link to={URLS.SHOP}>Shop</Link>
            </Item>
            <Item key="CART" icon={<ShoppingCartOutlined />}>
                <Link to={URLS.CART}>
                    <Badge count={cart.length} offset={[9, 0]}>
                        Cart
                    </Badge>
                </Link>
            </Item>
            {!isLoggedIn && (
                <React.Fragment>
                    <Item
                        key="REGISTER"
                        icon={<UserAddOutlined />}
                        className="float-right"
                    >
                        <Link to={URLS.REGISTER}>Register</Link>
                    </Item>
                    <Item
                        key="LOGIN"
                        icon={<UserOutlined />}
                        className="float-right"
                    >
                        <Link to={URLS.LOGIN}>Login</Link>
                    </Item>
                </React.Fragment>
            )}

            {isLoggedIn && (
                <SubMenu
                    icon={<SettingOutlined />}
                    title={username}
                    className="float-right"
                >
                    <Item
                        key={get(user, "role.dashboard_redirect", "DASHBOARD")}
                    >
                        <Link
                            to={get(
                                URLS,
                                get(user, "role.dashboard_redirect", "HOME"),
                                "/"
                            )}
                        >
                            Dashboard
                        </Link>
                    </Item>
                    <Item
                        key="LOGIN"
                        icon={<LogoutOutlined />}
                        onClick={logout}
                    >
                        Logout
                    </Item>
                </SubMenu>
            )}

            <span className="float-right p-1">
                <NavSearch />
            </span>
        </Menu>
    );
};

Header.propTypes = {
    user: PropTypes.object,
    cart: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
    cart: state.cart_items,
});

export default connect(mapStateToProps)(Header);
