import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import {
    ApartmentOutlined,
    DollarCircleOutlined,
    OrderedListOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import get from "lodash/get";
import { REDUX, URLS } from "../enums";
import { emptyUserCart, getUserCart } from "../API/Cart";
import { connect } from "react-redux";
import { print, toastError, isEmptyHTML } from "../utils";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    applyCouponToUserCart,
    getUserAddress,
    saveUserAddress,
} from "../API/User";
import { Redirect } from "react-router-dom";

const Checkout = (props) => {
    const {
        history,
        user,
        setLoading,
        emptyCartRedux,
        setIsCouponApplied,
    } = props;
    const [products, setProducts] = React.useState([]);
    const [address, setAddress] = React.useState("");
    const [hasAddress, setHasAddress] = React.useState(false);
    const [couponName, setCouponName] = React.useState("");
    const [totalAfterDiscount, setTotalAfterDiscount] = React.useState(
        undefined
    );

    const initialize = React.useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const usrRes = await getUserAddress(user.token).catch(print);
        if (usrRes && usrRes.data && usrRes.data.address) {
            setAddress(usrRes.data.address);
            setHasAddress(true);
        }
        const res = await getUserCart(user.token).catch(print);
        setLoading(false);
        if (!res || !res.data) return;
        let prods = get(res.data, "products", []);
        let prods_agg = get(res.data, "products_agg", []);
        let colors = get(res.data, "color", []);

        for (let prod of prods) {
            const prod_agg = prods_agg.find((i) => i._id === prod._id);
            if (!prod_agg) continue;
            Object.assign(prod, { ...prod, ...prod_agg });
        }
        for (let prod of prods) {
            const color = colors.find((i) => i._id === prod.color);
            if (!color) continue;
            prod["color"] = color.label;
        }

        setProducts([...prods]);
    }, [user, setLoading]);

    React.useEffect(() => {
        const prevPage = get(history, "location.state.from");
        if (prevPage !== URLS.CART) history.push(URLS.CART);
        initialize();
    }, [history, initialize]);

    const saveAddressToDB = async () => {
        setLoading(true);
        await saveUserAddress(address, user.token);
        setHasAddress(true);
        setLoading(false);
    };

    const emptyCart = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to empty your cart?"
        );
        if (!isConfirmed) return;
        if (typeof window !== "undefined") localStorage.removeItem("cart");
        emptyCartRedux();
        setLoading(true);
        const res = await emptyUserCart(user.token).catch(toastError);
        setLoading(false);
        if (!res) return;
        setProducts([]);
        toast.success("Shopping cart cleared");
        setCouponName("");
        setTotalAfterDiscount(undefined);
    };

    const applyDiscountCoupon = async () => {
        setLoading(true);
        const payload = { name: couponName };
        const totalResp = await applyCouponToUserCart(
            payload,
            user.token
        ).catch(toastError);
        setLoading(false);
        console.log(totalResp);
        let couponIsApplied = false;
        if (totalResp && typeof totalResp.data === "number") {
            couponIsApplied = true;
            setTotalAfterDiscount(totalResp.data);
        }
        setIsCouponApplied(couponIsApplied);
    };

    if (!user || !user.token) return <Redirect to={URLS.CART} />;

    return (
        <div className="row" style={{ padding: 20 }}>
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <ReactQuill
                    theme="snow"
                    value={address}
                    onChange={setAddress}
                />
                <br />
                <div style={{ textAlign: "center" }}>
                    <Button
                        onClick={saveAddressToDB}
                        type="primary"
                        className="mb-3"
                        block
                        shape="round"
                        icon={<ApartmentOutlined />}
                        size="large"
                        style={{ display: "inline-block", width: "30%" }}
                        disabled={isEmptyHTML(address)}
                    >
                        Save
                    </Button>
                </div>
                <hr />
                <h4>Got coupon?</h4>
                <br />
                <input
                    onChange={(e) => setCouponName(e.target.value)}
                    value={couponName}
                    type="text"
                    className="form-control"
                />
                <br />
                <Button
                    onClick={applyDiscountCoupon}
                    type="primary"
                    className="mb-3"
                    block
                    shape="round"
                    icon={<DollarCircleOutlined />}
                    size="large"
                    style={{ display: "inline-block", width: "30%" }}
                    disabled={!couponName}
                >
                    Apply
                </Button>
                <br />
            </div>

            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {products.map(({ title, color, count, price }, i) => (
                    <div key={i}>
                        <p>
                            {title} ({color}) x {count} = {price * count}
                        </p>
                    </div>
                ))}
                <hr />
                <p>
                    Cart Total: P
                    {products.reduce((agg, curr) => {
                        return agg + curr.count * curr.price;
                    }, 0)}
                </p>

                {typeof totalAfterDiscount === "number" &&
                    totalAfterDiscount > 0 && (
                        <p className="bg-success p-2">
                            Discount Applied: Total Payable: P
                            {totalAfterDiscount}
                        </p>
                    )}
                <div className="row">
                    <div className="col-md-6" style={{ textAlign: "right" }}>
                        <Button
                            onClick={() => {
                                history.push({
                                    pathname: URLS.PAYMENT,
                                    state: { from: URLS.CHECKOUT },
                                });
                            }}
                            type="primary"
                            className="mb-3"
                            shape="round"
                            icon={<OrderedListOutlined />}
                            size="large"
                            style={{ display: "inline-block", width: "60%" }}
                            disabled={isEmptyHTML(address) || !products.length}
                        >
                            Place Order
                        </Button>
                    </div>
                    <div className="col-md-6" style={{ textAlign: "left" }}>
                        <Button
                            onClick={emptyCart}
                            type="primary"
                            className="mb-3"
                            shape="round"
                            icon={<ShoppingCartOutlined />}
                            size="large"
                            style={{ display: "inline-block", width: "60%" }}
                        >
                            Empty Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Checkout.propTypes = {
    user: PropTypes.object,
    setLoading: PropTypes.func.isRequired,
    emptyCartRedux: PropTypes.func.isRequired,
    setIsCouponApplied: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    emptyCartRedux: () => dispatch({ type: REDUX.EMPTY_CART }),
    setIsCouponApplied: (bool) =>
        dispatch({ type: REDUX.COUPON_APPLIED, payload: bool }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
