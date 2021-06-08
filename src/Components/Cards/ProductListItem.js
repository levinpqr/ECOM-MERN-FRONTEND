import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Link } from "react-router-dom";
import { URLS } from "../../enums";

const COL_CLASS = "label label-default label-pill pull-xs-right";

const COL_TYPES = [
    { label: "Category", value: "category" },
    { label: "Sub Category", value: "subs" },
    { label: "Price", value: "price_str" },
    { label: "Shipping", value: "shipping" },
    { label: "Color", value: "color.label" },
    { label: "Brand", value: "brand.label" },
    { label: "Quantity", value: "quantity" },
    { label: "Sold", value: "sold" },
];

const ProductListItem = (props) => {
    const { product } = props;

    if (!product || !product._id) return <></>;

    return (
        <ul className="list-group">
            {COL_TYPES.map((col) =>
                col.value === "category" ? (
                    <li className="list-group-item" key={col.label}>
                        {col.label + " "}
                        <Link
                            key={col.value}
                            to={URLS.CATEGORY.replace(
                                ":slug",
                                product.category.slug
                            )}
                            className={COL_CLASS}
                        >
                            {product.category.name}
                        </Link>
                    </li>
                ) : col.value === "subs" ? (
                    <li className="list-group-item" key={col.label}>
                        {col.label}
                        {product.subs.map((i) => (
                            <Link
                                key={i._id}
                                to={URLS.SUBCATEGORY.replace(":slug", i.slug)}
                                className={COL_CLASS}
                            >
                                {i.name}
                            </Link>
                        ))}
                    </li>
                ) : (
                    <li className="list-group-item" key={col.label}>
                        {`${col.label} `}
                        <span className={COL_CLASS}>
                            {get(product, col.value)}
                        </span>
                    </li>
                )
            )}
        </ul>
    );
};

ProductListItem.propTypes = {
    product: PropTypes.object.isRequired,
};

export default ProductListItem;
