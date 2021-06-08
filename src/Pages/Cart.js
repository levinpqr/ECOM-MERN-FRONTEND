import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { URLS, REDUX } from "../enums";
import { ShoppingOutlined, LoginOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ProductCardInCheckout from "../Components/Cards/ProductCardInCheckout";
import { pushToCart } from "../API/Cart";
import { toastError } from "../utils";

const Cart = (props) => {
    const { setLoading, cart, user, setHeader, history } = props;

    React.useEffect(() => {
        setHeader("CART");
    }, [setHeader]);

    const totalPrice = cart.reduce((aggregatedValue, currentItem) => {
        const { count, price } = currentItem;
        return aggregatedValue + count * price;
    }, 0);

    const saveOrderToDB = async () => {
        setLoading(true);
        await pushToCart(cart, user.token).catch(toastError);
        setLoading(false);
        history.push({ pathname: URLS.CHECKOUT, state: { from: URLS.CART } });
    };

    return (
        <div className="container-fluid pt-2">
            <div className="row">
                <div className="col-md-8">
                    <h4>Cart / {cart.length} Product/s</h4>
                    {cart.length ? (
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Image</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Brand</th>
                                    <th scope="col">Color</th>
                                    <th scope="col">Count</th>
                                    <th scope="col">Shipping</th>
                                    <th scope="col">Remove</th>
                                </tr>
                            </thead>
                            {cart.map((c, i) => (
                                <ProductCardInCheckout
                                    key={c._id}
                                    product={c}
                                    index={i}
                                />
                            ))}
                        </table>
                    ) : (
                        <p>
                            No products in cart.{" "}
                            <Link to={URLS.SHOP}>Continue Shopping.</Link>
                        </p>
                    )}
                </div>

                <div className="col-md-4">
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={i}>
                            <p>
                                {c.title} x {c.count} = P{c.price * c.count}
                            </p>
                        </div>
                    ))}
                    <hr />
                    Total: <p>P{totalPrice}</p>
                    <hr />
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "70%",
                                display: "inline-block",
                            }}
                        >
                            {user ? (
                                <Button
                                    onClick={saveOrderToDB}
                                    type="primary"
                                    className="mb-1"
                                    block
                                    shape="round"
                                    icon={<ShoppingOutlined />}
                                    size="large"
                                    color="#1890ff"
                                    disabled={!cart.length}
                                >
                                    Proceed to Checkout
                                </Button>
                            ) : (
                                <Link
                                    style={{ color: "white" }}
                                    to={{
                                        pathname: URLS.LOGIN,
                                        state: { from: URLS.CART },
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        className="mb-1"
                                        block
                                        shape="round"
                                        icon={<LoginOutlined />}
                                        size="large"
                                        color="#1890ff"
                                    >
                                        {" "}
                                        Login to Checkout
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Cart.propTypes = {
    cart: PropTypes.array.isRequired,
    setHeader: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    cart: state.cart_items,
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
