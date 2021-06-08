import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { REDUX } from "../enums";
import { getAllProducts } from "../API/Product";
import { isNonEmptyArray, toastError } from "../utils";
import ProductCard from "../Components/Cards/ProductCard";
import Jumbotron from "../Components/Jumbotron/Jumbotron";
import { Pagination } from "antd";
import CategoryList from "../Components/Category/CategoryList";
import SubList from "../Components/Sub/SubList";

const initBody = {
    body: [],
    count: 0,
};

const initNewFilter = {
    limit: 10,
    sort: { createdAt: -1 },
    skip: 0,
};

const initBestFilter = {
    limit: 10,
    sort: { sold: -1 },
    skip: 0,
};

const Home = ({ setLoading, setHeader }) => {
    const [newProducts, setNewProducts] = React.useState(initBody);
    const [newFilter, setNewFilter] = React.useState(initNewFilter);

    const [bestProducts, setBestProducts] = React.useState(initBody);
    const [bestFilter, setBestFilter] = React.useState(initBestFilter);

    const listProducts = React.useCallback(
        async (filter) => {
            setLoading(true);
            const res = await getAllProducts(filter, true).catch(toastError);
            setLoading(false);
            if (res && res.data && isNonEmptyArray(res.data.body)) {
                return res.data;
            } else {
                return { count: 0, body: [] };
            }
        },
        [setLoading]
    );

    const onChangePage = async (page, type) => {
        let filter = {};
        if (type === "new") {
            filter = newFilter;
            filter.skip = (page - 1) * filter.limit;
            const res = await listProducts(filter);
            setNewProducts({ ...res });
            setNewFilter({ ...filter });
        } else {
            filter = bestFilter;
            filter.skip = (page - 1) * filter.limit;
            const res = await listProducts(filter);
            setBestProducts({ ...res });
            setBestFilter({ ...filter });
        }
    };

    const initialize = React.useCallback(async () => {
        const resNew = await listProducts(initNewFilter);
        setNewProducts({ ...resNew });
        const resBest = await listProducts(initBestFilter);
        setBestProducts({ ...resBest });
    }, [listProducts]);

    React.useEffect(() => {
        initialize();
        setHeader("HOME");
    }, [initialize, setHeader]);

    const newPage = Math.floor(newFilter.skip / newFilter.limit) + 1;
    const bestPage = Math.floor(bestFilter.skip / bestFilter.limit) + 1;

    return (
        <>
            <div className="jumbotron text-danger h1 font-weight bold text-center">
                <Jumbotron
                    text={[
                        `<span style="color: #03a9f4;">Latest Products</span>`,
                        `<span style="color: #03a9f4;">Best Sellers</span>`,
                    ]}
                />
            </div>

            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                New Arrivals
            </h4>
            <div className="container">
                <div className="row">
                    {newProducts.body.map((product) => (
                        <div key={product._id} className="col-md-4">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", paddingTop: 20 }}>
                    <Pagination
                        current={newPage}
                        total={newProducts.count}
                        defaultPageSize={newFilter.limit}
                        onChange={(page) => onChangePage(page, "new")}
                    />
                </div>
            </div>

            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                Best Sellers
            </h4>
            <div className="container">
                <div className="row">
                    {bestProducts.body.map((product) => (
                        <div key={product._id} className="col-md-4">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", paddingTop: 20 }}>
                    <Pagination
                        current={bestPage}
                        total={bestProducts.count}
                        defaultPageSize={bestFilter.limit}
                        onChange={(page) => onChangePage(page, "best")}
                    />
                </div>
            </div>
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                Category
            </h4>
            <CategoryList />
            <br />
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                Sub category
            </h4>
            <SubList />
            <br />
        </>
    );
};

Home.propTypes = {
    setLoading: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(null, mapDispatchToProps)(Home);
