import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../../enums";
import SideNav from "../../../Components/Nav/SideNav";
import { createProduct } from "../../../API/Product";
import { toastError } from "../../../utils";
import ProductForm from "../../../Components/Forms/ProductForm";

const CreateProduct = (props) => {
    const { user, setLoading, setSideNav, setHeader } = props;

    React.useEffect(() => {
        const path = window.location.pathname;
        setSideNav(Object.keys(URLS).find((key) => URLS[key] === path) || "");
        setHeader("ADMIN_DASHBOARD");
    }, [setSideNav, setHeader]);

    const onSubmit = async (payload) => {
        setLoading(true);
        const res = await createProduct(payload, user.token).catch(toastError);
        setLoading(false);
        return Boolean(res);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <br />
                    <h4>Product Create Page</h4>
                    <ProductForm onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    );
};

CreateProduct.propTypes = {
    user: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
    setSideNav: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapStateTopProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setSideNav: (nav) =>
        dispatch({ type: REDUX.SET_USERSIDENAV, payload: nav }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(mapStateTopProps, mapDispatchToProps)(CreateProduct);
