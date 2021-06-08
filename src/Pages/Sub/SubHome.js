import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { REDUX } from "../../enums";
import get from "lodash/get";
import { listSubs } from "../../API/Sub";
import { isNonEmptyArray, toastError } from "../../utils";
import { getAllProducts } from "../../API/Product";
import ProductCard from "../../Components/Cards/ProductCard";

const CategoryHome = (props) => {
    const { match, setLoading, setHeader } = props;

    const [sub, setSub] = React.useState({});
    const [products, setProducts] = React.useState([]);
    const [prodCount, setProdCount] = React.useState(0);

    const initialize = React.useCallback(async () => {
        const slug = get(match, "params.slug");
        if (!slug) return;
        setLoading(true);
        const subFilter = { limit: 1, where: { slug } };
        const res = await listSubs(subFilter).catch(toastError);
        if (res && isNonEmptyArray(res.data)) setSub({ ...res.data[0] });
        else return setLoading(false);
        const prodFilter = { where: { $and: [{ subs_str: res.data[0]._id }] } };
        const res2 = await getAllProducts(prodFilter, true).catch(toastError);
        if (res2 && res2.data) {
            if (isNonEmptyArray(res2.data.body))
                setProducts([...res2.data.body]);
            setProdCount(res2.data.count);
        }
        setLoading(false);
    }, [match, setLoading]);

    React.useEffect(() => {
        initialize();
        setHeader("");
    }, [initialize, setHeader]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                        {prodCount} Product/s in "{sub.name || ""}" sub category
                    </h4>
                </div>
            </div>

            <div className="row">
                {products.map((i) => (
                    <div className="col-md-4" key={i._id}>
                        <ProductCard product={i} />
                    </div>
                ))}
            </div>
        </div>
    );
};

CategoryHome.propTypes = {
    setLoading: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(null, mapDispatchToProps)(CategoryHome);
