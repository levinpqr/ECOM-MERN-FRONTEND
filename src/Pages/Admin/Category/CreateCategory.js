import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../../enums";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import get from "lodash/get";
import {
    createCategory,
    getCategories,
    deleteCategory,
} from "../../../API/Category";
import { Link } from "react-router-dom";
import CategoryForm from "../../../Components/Forms/CategoryForm";
import LocalSearch from "../../../Components/Forms/LocalSearch";
import SideNav from "../../../Components/Nav/SideNav";
import { print, toastError, toastSuccess } from "../../../utils";

const CreateCategory = (props) => {
    const { user, setSideNav, setLoading, setHeader } = props;

    const [categories, setCategories] = React.useState([]);

    const listCategories = React.useCallback(async () => {
        setLoading(true);
        await getCategories()
            .then(({ data }) => setCategories([...data]))
            .catch(print);
        setLoading(false);
    }, [setLoading]);

    React.useEffect(() => {
        listCategories();
        setHeader("ADMIN_DASHBOARD");
    }, [listCategories, setHeader]);

    const [formData, setFormData] = React.useState({
        name: "",
        search: "",
    });

    const { name, search } = formData;

    const onChange = (e) => {
        const field_name = get(e, "target.name", "");
        if (!field_name) return;
        setFormData({
            ...formData,
            [field_name]: get(e, "target.value", ""),
        });
    };

    const onSubmit = async () => {
        setLoading(true);
        await createCategory(name, get(user, "token", ""))
            .then(({ data }) => {
                setFormData({ ...formData, name: "" });
                toastSuccess(`"${data.name}" is created`);
                listCategories();
            })
            .catch(toastError);
        setLoading(false);
    };

    React.useEffect(() => {
        const path = window.location.pathname;
        setSideNav(Object.keys(URLS).find((key) => URLS[key] === path) || "");
    }, [setSideNav]);

    const onDeleteCategory = async (slug, category_name) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${category_name}?`
        );
        if (confirmDelete) {
            setLoading(true);
            await deleteCategory(slug, get(user, "token", ""))
                .then((res) => {
                    toastSuccess(`${get(res, "data.name")} deleted`);
                    listCategories();
                })
                .catch(toastError);
            setLoading(false);
        }
    };

    const filtering = ({ name }) => {
        return Boolean(
            !search || name.toLowerCase().includes(search.toLowerCase())
        );
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <br />
                    <h4>Category Create Page</h4>
                    <CategoryForm
                        name={name}
                        onChange={onChange}
                        onSubmit={onSubmit}
                    />

                    <div className="col-sm-6">
                        <LocalSearch search={search} onChange={onChange} />

                        {categories
                            .filter(filtering)
                            .map(({ _id, name, slug }) => (
                                <div
                                    className="alert alert-secondary"
                                    key={_id}
                                >
                                    {name}
                                    <span
                                        id={slug}
                                        onClick={() =>
                                            onDeleteCategory(slug, name)
                                        }
                                        className="btn btn-sm float-right"
                                    >
                                        <DeleteOutlined className="text-warning" />
                                    </span>
                                    <Link
                                        to={URLS.ADMIN_CATEGORY.replace(
                                            ":slug",
                                            slug
                                        )}
                                    >
                                        <span className="btn btn-sm float-right">
                                            <EditOutlined className="text-warning" />
                                        </span>
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateCategory.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateCategory);
