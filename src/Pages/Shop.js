import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    MAX_PRICE,
    PRICE_RANGE_DEFAULT,
    FILTER_DELAY_MS,
    REDUX,
    SHIPPING_CHOICES,
} from "../enums";
import {
    getAllProductBrands,
    getAllProductColors,
    getAllProducts,
} from "../API/Product";
import { isNonEmptyArray, handleProductFilters, toastError } from "../utils";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import ProductCard from "../Components/Cards/ProductCard";
import { Menu, Slider, Checkbox, Button, Tooltip } from "antd";
import {
    DollarOutlined,
    DownSquareOutlined,
    StarOutlined,
    ClearOutlined,
    FormatPainterOutlined,
    TagsOutlined,
    CarOutlined,
} from "@ant-design/icons";
import { getCategories } from "../API/Category";
import StarFilter from "../Components/Forms/StarFilter";
import { getSubs } from "../API/Sub";

const SHIPPING_TITLE = (
    <span className="h6">
        <CarOutlined /> Shipping
    </span>
);

const COLOR_TITLE = (
    <span className="h6">
        <FormatPainterOutlined /> Colors
    </span>
);

const BRAND_TITLE = (
    <span className="h6">
        <TagsOutlined /> Brands
    </span>
);

const SUB_TITLE = (
    <span className="h6">
        <DownSquareOutlined /> Sub Categories
    </span>
);

const RATING_TITLE = (
    <span className="h6">
        <StarOutlined /> Rating
    </span>
);

const CATEGORIES_TITLE = (
    <span className="h6">
        <DownSquareOutlined /> Categories
    </span>
);

const PRICE_TITLE = (
    <span className="h6">
        <DollarOutlined /> Price
    </span>
);

const Shop = (props) => {
    const { setLoading, setHeader, searchText } = props;

    const [products, setProducts] = React.useState([]);
    const [productCount, setProductCount] = React.useState(0);
    const [priceVal, setPrice] = React.useState(PRICE_RANGE_DEFAULT);
    const [filterTimeout, setFilterTimeout] = React.useState(0);
    const [categories, setCategories] = React.useState([]);
    const [checkedCategs, setCheckedCategs] = React.useState([]);
    const [ratingFilter, setRatingFilter] = React.useState(undefined);
    const [subs, setSubs] = React.useState([]);
    const [checkedSubs, setCheckedSubs] = React.useState([]);
    const [brands, setBrands] = React.useState([]);
    const [checkedBrands, setCheckedBrands] = React.useState([]);
    const [colors, setColors] = React.useState([]);
    const [checkedColors, setCheckedColors] = React.useState([]);
    const [checkedShipping, setCheckedShipping] = React.useState([]);

    const getCategoryFilters = React.useCallback(async () => {
        const categFilter = { fields: { name: 1, _id: 1 } };
        const res = await getCategories(categFilter).catch(toastError);
        if (res && isNonEmptyArray(res.data)) setCategories([...res.data]);
    }, []);

    const getSubsFilters = React.useCallback(async () => {
        const res = await getSubs({}, { name: 1, _id: 1 }).catch(toastError);
        if (res && isNonEmptyArray(res.data)) setSubs([...res.data]);
    }, []);

    const getColorFilters = React.useCallback(async () => {
        const res = await getAllProductColors().catch(toastError);
        if (res && isNonEmptyArray(res.data)) setColors([...res.data]);
    }, []);

    const getBrandFilters = React.useCallback(async () => {
        const res = await getAllProductBrands().catch(toastError);
        if (res && isNonEmptyArray(res.data)) setBrands([...res.data]);
    }, []);

    const getProducts = React.useCallback(
        async (
            txt,
            price,
            categories,
            rating_ave,
            subs_filter,
            brands_filter,
            colors_filter,
            ship_filter
        ) => {
            setLoading(true);
            const prodFilter = handleProductFilters(
                txt,
                price,
                categories,
                rating_ave,
                subs_filter,
                brands_filter,
                colors_filter,
                ship_filter
            );
            const res = await getAllProducts(prodFilter, true).catch(
                toastError
            );
            if (res && res.data) {
                setProducts([...get(res, "data.body", [])]);
                setProductCount(get(res, "data.count", 0));
            }
            setLoading(false);
        },
        [setLoading]
    );

    const onChangeFilters = (name, value) => {
        let priceDefault = cloneDeep(PRICE_RANGE_DEFAULT);
        const checkedCatgs = cloneDeep(checkedCategs);
        const checkedSbs = cloneDeep(checkedSubs);
        let ratingVal = ratingFilter;
        const checkedBrnds = cloneDeep(checkedBrands);
        const checkedColrs = cloneDeep(checkedColors);
        const checkedShip = cloneDeep(checkedShipping);
        if (name === "price") {
            priceDefault = value;
            setPrice([...priceDefault]);
        } else if (name === "category") {
            const id = get(value, "target.value", "");
            const checked = Boolean(get(value, "target.checked"));
            const index = checkedCatgs.indexOf(id);
            if (index >= 0 && !checked) checkedCatgs.splice(index, 1);
            else if (index < 0 && checked) checkedCatgs.push(id);
            setCheckedCategs([...checkedCatgs]);
        } else if (name === "rating") {
            setRatingFilter(value);
            ratingVal = value;
        } else if (name === "subs") {
            const index = checkedSbs.indexOf(value);
            if (index >= 0) checkedSbs.splice(index, 1);
            else checkedSbs.push(value);
            setCheckedSubs([...checkedSbs]);
        } else if (name === "brand") {
            const id = get(value, "target.value", "");
            const checked = Boolean(get(value, "target.checked"));
            const index = checkedBrnds.indexOf(id);
            if (index >= 0 && !checked) checkedBrnds.splice(index, 1);
            else if (index < 0 && checked) checkedBrnds.push(id);
            setCheckedBrands([...checkedBrnds]);
        } else if (name === "color") {
            const id = get(value, "target.value", "");
            const checked = Boolean(get(value, "target.checked"));
            const index = checkedColrs.indexOf(id);
            if (index >= 0 && !checked) checkedColrs.splice(index, 1);
            else if (index < 0 && checked) checkedColrs.push(id);
            setCheckedColors([...checkedColrs]);
        } else if (name === "shipping") {
            const id = get(value, "target.value", "");
            const checked = Boolean(get(value, "target.checked"));
            const index = checkedShip.indexOf(id);
            if (index >= 0 && !checked) checkedShip.splice(index, 1);
            else if (index < 0 && checked) checkedShip.push(id);
            setCheckedShipping([...checkedShip]);
        }

        if (filterTimeout) clearTimeout(filterTimeout);

        const timeoutFunction = () => {
            getProducts(
                searchText,
                priceDefault,
                checkedCatgs,
                ratingVal,
                checkedSbs,
                checkedBrnds,
                checkedColrs,
                checkedShip
            );
        };

        setFilterTimeout(setTimeout(timeoutFunction, FILTER_DELAY_MS));
    };

    React.useEffect(() => {
        getCategoryFilters();
        getSubsFilters();
        getColorFilters();
        getBrandFilters();
        getProducts(searchText);
        setHeader("SHOP");
    }, [
        getCategoryFilters,
        getSubsFilters,
        getColorFilters,
        getBrandFilters,
        getProducts,
        setHeader,
    ]);

    React.useEffect(() => {
        const delayed = setTimeout(
            () => getProducts(searchText, priceVal),
            2000
        );
        return () => clearTimeout(delayed);
    }, [searchText, getProducts]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search / Filter Menu</h4>
                    <hr />
                    <Menu defaultOpenKeys={[]} mode="inline">
                        <Menu.SubMenu key="1" title={PRICE_TITLE}>
                            <div>
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(v) => `P${v}`}
                                    range
                                    defaultValue={priceVal}
                                    // value={priceVal}
                                    onChange={(val) =>
                                        onChangeFilters("price", val)
                                    }
                                    max={MAX_PRICE}
                                />
                            </div>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="2" title={CATEGORIES_TITLE}>
                            <div
                                style={{
                                    marginTop: "-10px",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                {categories.map((i) => (
                                    <div
                                        key={i._id}
                                        style={{ paddingTop: "1px" }}
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                onChangeFilters("category", e)
                                            }
                                            className="pb-2 pl-4 pr-4"
                                            value={i._id}
                                            name="category"
                                            checked={checkedCategs.includes(
                                                i._id
                                            )}
                                        >
                                            {i.name}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="3" title={RATING_TITLE}>
                            <div
                                className="row"
                                style={{ justifyContent: "left" }}
                            >
                                <div className="col-md-9">
                                    <StarFilter
                                        starClick={(i) =>
                                            onChangeFilters("rating", i)
                                        }
                                        currentValue={ratingFilter}
                                    />
                                </div>
                                <div
                                    className="col-md-3"
                                    style={{
                                        marginLeft: "-50px",
                                        paddingTop: "20px",
                                    }}
                                >
                                    <Tooltip title="Clear Filter">
                                        <Button
                                            disabled={!Boolean(ratingFilter)}
                                            onClick={() =>
                                                onChangeFilters(
                                                    "rating",
                                                    undefined
                                                )
                                            }
                                            type="primary"
                                            shape="circle"
                                            icon={<ClearOutlined />}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="4" title={SUB_TITLE}>
                            <div style={{ marginTop: "-10px" }}>
                                {subs.map((s) => (
                                    <div
                                        key={s._id}
                                        onClick={() =>
                                            onChangeFilters("subs", s._id)
                                        }
                                        className={
                                            "p-1 m-1 badge badge-" +
                                            (checkedSubs.includes(s._id)
                                                ? "info"
                                                : "secondary")
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {s.name}
                                    </div>
                                ))}
                            </div>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="5" title={BRAND_TITLE}>
                            <div
                                style={{
                                    marginTop: "-10px",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                {brands.map((i) => (
                                    <div
                                        key={i._id}
                                        style={{ paddingTop: "1px" }}
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                onChangeFilters("brand", e)
                                            }
                                            className="pb-2 pl-4 pr-4"
                                            value={i._id}
                                            name="brand"
                                            checked={checkedBrands.includes(
                                                i._id
                                            )}
                                        >
                                            {i.label}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="6" title={COLOR_TITLE}>
                            <div
                                style={{
                                    marginTop: "-10px",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                {colors.map((i) => (
                                    <div
                                        key={i._id}
                                        style={{ paddingTop: "1px" }}
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                onChangeFilters("color", e)
                                            }
                                            className="pb-2 pl-4 pr-4"
                                            value={i._id}
                                            name="color"
                                            checked={checkedColors.includes(
                                                i._id
                                            )}
                                        >
                                            {i.label}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="7" title={SHIPPING_TITLE}>
                            <div
                                style={{
                                    marginTop: "-10px",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                {SHIPPING_CHOICES.map((i) => (
                                    <div key={i} style={{ paddingTop: "1px" }}>
                                        <Checkbox
                                            onChange={(e) =>
                                                onChangeFilters("shipping", e)
                                            }
                                            className="pb-2 pl-4 pr-4"
                                            value={i}
                                            name="shipping"
                                            checked={checkedShipping.includes(
                                                i
                                            )}
                                        >
                                            {i}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Menu.SubMenu>
                    </Menu>
                </div>

                <div className="col-md-9 pt-2">
                    <h4 className="text-danger">Products</h4>

                    {isNonEmptyArray(products) ? (
                        <div className="row pb-5">
                            {products.map((p) => (
                                <div key={p._id} className="col-md-4 mt-3">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

Shop.propTypes = {
    setLoading: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

const mapStateToProps = (state) => ({
    searchText: state.search_text.text,
});

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
