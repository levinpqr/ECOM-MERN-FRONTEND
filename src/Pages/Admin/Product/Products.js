import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SideNav from "../../../Components/Nav/SideNav";
import AdminProductCard from "../../../Components/Cards/AdminProductCard";
import { getAllProducts, deleteProduct } from "../../../API/Product";
import { removeImage } from "../../../API/Cloudinary";
import {
    isNonEmptyArray,
    print,
    toastError,
    toastSuccess,
} from "../../../utils";
import { REDUX, URLS } from "../../../enums";

const Products = (props) => {
    const { setLoading, user, setSideNav, setHeader } = props;
    const [products, setProducts] = React.useState([]);

    const handleDelete = async (title, slug, images) => {
        const conf = window.confirm(`Delete ${title}?`);
        if (!conf) return;
        setLoading(true);
        const res = await deleteProduct(slug, user.token).catch(toastError);
        setLoading(false);
        if (!res) return;
        await fetchProducts({ limit: 100, sort: { createdAt: -1 } });
        if (isNonEmptyArray(images)) {
            for (let image of images) {
                removeImage(image.public_id, user.token).catch(print);
            }
        }
        toastSuccess("Delete success");
    };

    const fetchProducts = React.useCallback(
        async (filter) => {
            setLoading(true);
            const res = await getAllProducts(filter).catch(print);
            if (res && isNonEmptyArray(res.data)) setProducts([...res.data]);
            setLoading(false);
        },
        [setLoading]
    );

    React.useEffect(() => {
        fetchProducts({ limit: 100, sort: { createdAt: -1 } });
        const path = window.location.pathname;
        setSideNav(Object.keys(URLS).find((key) => URLS[key] === path) || "");
        setHeader("ADMIN_DASHBOARD");
    }, [fetchProducts, setSideNav, setHeader]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <h4>All Products</h4>
                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4 pb-3">
                                <AdminProductCard
                                    product={product}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

Products.propTypes = {
    user: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
    setSideNav: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setSideNav: (nav) =>
        dispatch({ type: REDUX.SET_USERSIDENAV, payload: nav }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
