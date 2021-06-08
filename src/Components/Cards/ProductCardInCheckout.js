import React from "react";
import PropTypes from "prop-types";
import ModalImage from "react-modal-image";
import noImage from "../../No Image.jpg";
import { isNonEmptyArray } from "../../utils";
import { InputNumber } from "antd";
import { CART_QUANTITY_PROPS, REDUX, SHIPPING_CHOICES } from "../../enums";
import cloneDeep from "lodash/cloneDeep";
import { connect } from "react-redux";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    DeleteFilled,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ product, index, cart, setCart }) => {
    const { title, price, brand, color, count, images, shipping } = product;

    const displayImage = isNonEmptyArray(images) ? images[0].url : noImage;

    const handleCount = (value) => {
        let val = cloneDeep(count);
        try {
            val = Math.floor(parseInt(value));
        } catch (e) {
            console.log(e);
        }
        if (isNaN(val) || typeof val !== "number" || val <= 0) return;
        patchProduct({ ...product, count: val });
    };

    const setCardStorage = (cartArr) => {
        setCart([...cartArr]);
        localStorage.setItem("cart", JSON.stringify(cartArr));
    };

    const patchProduct = (product) => {
        let cartClone = cloneDeep(cart);
        cartClone[index] = product;
        setCardStorage(cartClone);
    };

    const handleRemove = () => {
        let cartClone = cloneDeep(cart);
        cartClone.splice(index, 1);
        setCardStorage(cartClone);
    };

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: "100px", height: "auto" }}>
                        <ModalImage small={displayImage} large={displayImage} />
                    </div>
                </td>
                <td>{title}</td>
                <td>{price}</td>
                <td>{brand.label}</td>
                <td>{color.label}</td>
                <td className="text-center">
                    <InputNumber
                        min={CART_QUANTITY_PROPS.MIN}
                        max={CART_QUANTITY_PROPS.MAX}
                        onChange={handleCount}
                        value={count}
                        keyboard={false}
                        style={{ width: "60px" }}
                    />
                </td>
                <td className="text-center">
                    {shipping === SHIPPING_CHOICES[0] ? (
                        <CheckCircleFilled
                            className="text-success"
                            style={{ fontSize: "20px" }}
                        />
                    ) : (
                        <CloseCircleFilled
                            className="text-danger"
                            style={{ fontSize: "20px" }}
                        />
                    )}
                </td>
                <td className="text-center">
                    <DeleteFilled
                        onClick={handleRemove}
                        className="text-danger pointer"
                        style={{ fontSize: "22px" }}
                    />
                </td>
            </tr>
        </tbody>
    );
};

ProductCardInCheckout.propTypes = {
    product: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    cart: PropTypes.array.isRequired,
    setCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    cart: state.cart_items,
});

const mapDispatchToProps = (dispatch) => ({
    setCart: (cart) => dispatch({ type: REDUX.ADD_TO_CART, payload: cart }),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductCardInCheckout);
