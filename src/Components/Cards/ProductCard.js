import React from "react";
import PropTypes from "prop-types";
import { Card, Tooltip } from "antd";
import { addToCart, isNonEmptyArray } from "../../utils";
import noImage from "../../No Image.jpg";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import StaticRating from "../StaticRating/StaticRating";
import { REDUX, URLS } from "../../enums";
import { connect } from "react-redux";

const MAX_DISPLAY_CHARS = 60;

const ProductCard = ({ product, setCart, setDrawer }) => {
    const { title, slug, description, images, price } = product;

    const [tooltip, setTooltip] = React.useState("Click to add");

    const handleAddToCart = () => {
        const unique = addToCart(product);
        setTooltip("Added");
        setCart([...unique]);
        setDrawer(true);
    };

    const [shortenedDesc, setShortenedDesc] = React.useState("");

    React.useEffect(() => {
        if (typeof description === "string") {
            const words = description.split(" ");
            let finalDesc = "";
            for (let word of words) {
                if (finalDesc.length + word.length + 1 > MAX_DISPLAY_CHARS) {
                    finalDesc = `${finalDesc}....`;
                    break;
                }
                finalDesc = `${finalDesc} ${word}`;
            }
            setShortenedDesc(finalDesc);
        }
    }, [description]);

    return (
        <>
            <StaticRating product={product} />
            <Card
                cover={
                    <img
                        src={isNonEmptyArray(images) ? images[0].url : noImage}
                        style={{
                            height: "200px",
                            objectFit: "cover",
                        }}
                        className="p-1"
                        alt={title}
                    />
                }
                hoverable
                actions={[
                    <Link to={URLS.PRODUCT_VIEW.replace(":slug", slug)}>
                        <EyeOutlined
                            className="text-warning"
                            style={{ fontSize: 19 }}
                        />
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCart}>
                            <ShoppingCartOutlined
                                className="text-danger"
                                style={{ fontSize: 18 }}
                            />
                        </a>
                    </Tooltip>,
                ]}
            >
                <Card.Meta
                    title={`${title} - P ${price}`}
                    description={shortenedDesc}
                />
            </Card>
        </>
    );
};

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    setCart: PropTypes.func.isRequired,
    setDrawer: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setCart: (cart) => dispatch({ type: REDUX.ADD_TO_CART, payload: cart }),
    setDrawer: (bool) => dispatch({ type: REDUX.SET_DRAWER, payload: bool }),
});

export default connect(null, mapDispatchToProps)(ProductCard);
