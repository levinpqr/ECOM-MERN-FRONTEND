import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import get from "lodash/get";
import { getAllProducts, rateAProduct } from "../API/Product";
import { isNonEmptyArray, toastError, toastSuccess } from "../utils";
import { REDUX } from "../enums";
import SingleProduct from "../Components/Cards/SingleProduct";
import ProductCard from "../Components/Cards/ProductCard";
import { Spin } from "antd";

const Product = (props) => {
    const { setLoading, user, setHeader } = props;

    const [product, setProduct] = React.useState({});
    const [rating, setRating] = React.useState(1);
    const [relatedProducts, setRelatedProducts] = React.useState([]);
    const [relatedLoading, setRelatedLoading] = React.useState(true);

    const initialize = React.useCallback(async () => {
        setLoading(true);
        const slug = get(props, "match.params.slug");
        if (!slug) return;
        const res = await getAllProducts({ where: { slug }, limit: 1 }).catch(
            toastError
        );
        if (res && isNonEmptyArray(res.data)) {
            const prod = res.data[0];
            setProduct({ ...prod, price_str: `P ${prod.price}` });
            const user_id = get(user, "_id");
            if (isNonEmptyArray(prod.ratings) && user_id) {
                const yourRating = prod.ratings.find(
                    (i) => i.postedBy === user_id
                );
                if (yourRating) setRating(yourRating.star);
            }
        }
        setLoading(false);
    }, [props, user, setLoading]);

    const getRelatedProducts = React.useCallback(
        async (productId, categoryId) => {
            setRelatedLoading(true);
            const res = await getAllProducts({
                where: {
                    $and: [
                        { category_str: categoryId },
                        { _id_str: { $ne: productId } },
                    ],
                },
                limit: 3,
            }).catch(toastError);
            if (res && isNonEmptyArray(res.data))
                setRelatedProducts([...res.data]);
            setRelatedLoading(false);
        },
        []
    );

    React.useEffect(() => {
        const categoryId = get(product, "category._id", "");
        const productId = get(product, "_id", "");
        if (categoryId && productId) {
            getRelatedProducts(productId, categoryId);
        }
    }, [product, getRelatedProducts]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        initialize();
        setHeader("");
    }, [initialize, setHeader]);

    const onClickRating = (rating) => {
        setRating(parseFloat(rating));
    };

    const onRateProduct = async () => {
        setLoading(true);

        const res = await rateAProduct(
            rating,
            product._id,
            get(user, "token")
        ).catch(toastError);
        if (res) {
            toastSuccess("Thanks for your review. It will appear soon");
            initialize();
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct
                    product={product}
                    onClickRating={onClickRating}
                    rating={rating}
                    onRateProduct={onRateProduct}
                />
            </div>
            <div className="row">
                <div className="col text-center pt-5 pb-5">
                    <br />
                    {relatedLoading ? (
                        <Spin />
                    ) : (
                        <>
                            <h4>Related Products</h4>
                            <br />
                        </>
                    )}
                </div>
            </div>
            <div className="row pb-5">
                {relatedLoading ? null : relatedProducts.length ? (
                    <>
                        {relatedProducts.map((p) => (
                            <div key={p._id} className="col-md-4">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-center col">No Products Found</div>
                )}
            </div>
        </div>
    );
};

Product.propTypes = {
    user: PropTypes.object,
    setLoading: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
