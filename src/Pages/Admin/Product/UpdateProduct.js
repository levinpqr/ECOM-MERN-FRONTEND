import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SideNav from "../../../Components/Nav/SideNav";
import { REDUX, URLS } from "../../../enums";
import ProductForm from "../../../Components/Forms/ProductForm";
import get from "lodash/get";
import { updateProduct } from "../../../API/Product";
import { toastError } from "../../../utils";
import { Redirect } from "react-router-dom";

const UpdateProduct = (props) => {
    const { user, setLoading, setSideNav, match, setHeader } = props;

    const [redirect, setRedirect] = React.useState(false);

    React.useEffect(() => {
        setSideNav("ADMIN_PRODUCT");
        setHeader("ADMIN_DASHBOARD");
    }, [setSideNav, setHeader]);

    const onSubmit = async (payload, slug) => {
        setLoading(true);
        const res = await updateProduct(payload, slug, user.token).catch(
            toastError
        );
        return Boolean(res);
    };

    const handleRedirect = () => setRedirect(true);
    if (redirect) {
        return <Redirect to={URLS.ADMIN_PRODUCTS} />;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <br />
                    <h4>Product Update Page</h4>
                    <ProductForm
                        onSubmit={onSubmit}
                        isEditingSlug={get(match, "params.slug", undefined)}
                        handleRedirect={handleRedirect}
                    />
                </div>
            </div>
        </div>
    );
};

UpdateProduct.propTypes = {
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

export default connect(mapStateTopProps, mapDispatchToProps)(UpdateProduct);
