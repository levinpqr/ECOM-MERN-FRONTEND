import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../enums";
import noImage from "../../No Image.jpg";
import { Button, Drawer } from "antd";
import { isNonEmptyArray } from "../../utils";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

const SlideDrawer = (props) => {
    const { cart, drawer, setDrawer } = props;
    const handleClose = () => {
        setDrawer(false);
    };

    return (
        <Drawer
            className="text-center"
            title={`${cart.length} Product/s`}
            placement="right"
            closable={false}
            onClose={() => setDrawer(false)}
            visible={drawer}
        >
            {cart.map((p) => (
                <div key={p._id} className="row">
                    <div className="col">
                        <img
                            src={
                                isNonEmptyArray(p.images)
                                    ? p.images[0].url
                                    : noImage
                            }
                            style={{
                                width: "100%",
                                height: "50px",
                                objectFit: "cover",
                            }}
                        />
                        <p className="text-center bg-secondary text-light">
                            {p.title} x {p.count}
                        </p>
                    </div>
                </div>
            ))}
            <Link to={URLS.CART}>
                <Button
                    type="primary"
                    className="mb-1"
                    block
                    shape="round"
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    color="#1890ff"
                    onClick={handleClose}
                >
                    {" "}
                    Go To Cart
                </Button>
            </Link>
        </Drawer>
    );
};

SlideDrawer.propTypes = {
    cart: PropTypes.array.isRequired,
    setDrawer: PropTypes.func.isRequired,
    drawer: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    cart: state.cart_items,
    drawer: state.slide_drawer,
});

const mapDispatchToProps = (dispatch) => ({
    setDrawer: (bool) => dispatch({ type: REDUX.SET_DRAWER, payload: bool }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideDrawer);
