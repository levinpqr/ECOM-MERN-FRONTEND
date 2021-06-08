import React from "react";
import PropTypes from "prop-types";
import SideNav from "../../../Components/Nav/SideNav";
import get from "lodash/get";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../../enums";
import { getCategory, updateCategory } from "../../../API/Category";
import CategoryForm from "../../../Components/Forms/CategoryForm";
import { print, toastError, toastSuccess } from "../../../utils";

const UpdateCategory = (props) => {
    const { user, setSideNav, setLoading, match, history, setHeader } = props;

    const [formData, setFormData] = React.useState({
        name: "",
    });

    const { name } = formData;

    const onChange = (e) => {
        setFormData({
            ...formData,
            [get(e, "target.name")]: get(e, "target.value"),
        });
    };

    const onSubmit = async () => {
        setLoading(true);
        await updateCategory(
            get(match, "params.slug", undefined),
            name,
            get(user, "token")
        )
            .then(() => {
                toastSuccess("Category updated");

                history.push(URLS.ADMIN_CATEGORIES);
            })
            .catch(toastError);
        setLoading(false);
    };

    const getThisCategory = React.useCallback(async () => {
        setLoading(true);
        // to-do NOT FOUND PAGE
        await getCategory(get(match, "params.slug", undefined))
            .then(({ data }) => {
                setFormData((obj) => {
                    return { ...obj, name: get(data, "name", "") };
                });
            })
            .catch(print);
        setLoading(false);
    }, [setLoading, match]);

    React.useEffect(() => {
        getThisCategory();
        setSideNav("ADMIN_CATEGORIES");
        setHeader("ADMIN_DASHBOARD");
    }, [getThisCategory, setSideNav, setHeader]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <CategoryForm
                        name={name}
                        title="Update Category"
                        onChange={onChange}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

UpdateCategory.propTypes = {
    user: PropTypes.object,
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCategory);
