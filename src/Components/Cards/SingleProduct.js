import React from "react";
import PropTypes from "prop-types";
import { Card, Tabs, Tooltip } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { isNonEmptyArray, addToCart } from "../../utils";
import ProductListItem from "./ProductListItem";
import NoImage from "../../No Image.jpg";
import RatingModal from "../Modal/RatingModal";
import StarRating from "react-star-ratings";
import { MAX_RATE, REDUX } from "../../enums";
import StaticRating from "../StaticRating/StaticRating";
import { connect } from "react-redux";

const SingleProduct = (props) => {
    const {
        product,
        onClickRating,
        rating,
        onRateProduct,
        setCart,
        setDrawer,
    } = props;
    const { title, description, images, _id } = product;

    const [tooltip, setTooltip] = React.useState("Click to add");

    const handleAddToCart = () => {
        const unique = addToCart(product);
        setTooltip("Added");
        setCart([...unique]);
        setDrawer(true);
    };

    return (
        <>
            <div className="col-md-7">
                <Carousel showArrows autoPlay infiniteLoop>
                    {isNonEmptyArray(images) ? (
                        images.map((i, index) => (
                            <img src={i.url} key={i.public_url + index} />
                        ))
                    ) : (
                        <Card
                            cover={
                                <img
                                    src={NoImage}
                                    className="mb-3 card-image"
                                />
                            }
                        ></Card>
                    )}
                </Carousel>
                <Tabs type="card">
                    <Tabs.TabPane tab="Description" key="1">
                        {description}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="More" key="2">
                        sdomething/
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>
                <StaticRating product={product} />
                <Card
                    actions={[
                        <Tooltip title={tooltip}>
                            <a onClick={handleAddToCart}>
                                <ShoppingCartOutlined className="text-success" />
                                <br />
                                Add to Cart
                            </a>
                        </Tooltip>,
                        <Link to="/">
                            <HeartOutlined className="text-info" /> <br />
                            Add to Wishlist
                        </Link>,
                        <RatingModal onRateProduct={onRateProduct}>
                            <StarRating
                                name={_id}
                                numberOfStars={MAX_RATE}
                                rating={rating}
                                changeRating={onClickRating}
                                isSelectable
                                starRatedColor="#03a9f4"
                                starHoverColor="#65caf7"
                            />
                        </RatingModal>,
                    ]}
                >
                    <ProductListItem product={product} />
                </Card>
            </div>
        </>
    );
};

SingleProduct.propTypes = {
    product: PropTypes.object.isRequired,
    onClickRating: PropTypes.func.isRequired,
    rating: PropTypes.number.isRequired,
    onRateProduct: PropTypes.func.isRequired,
    setCart: PropTypes.func.isRequired,
    setDrawer: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setCart: (cart) => dispatch({ type: REDUX.ADD_TO_CART, payload: cart }),
    setDrawer: (bool) => dispatch({ type: REDUX.SET_DRAWER, payload: bool }),
});

export default connect(null, mapDispatchToProps)(SingleProduct);
