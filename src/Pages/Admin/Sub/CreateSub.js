import React from "react";
import PropTypes from "prop-types";
import SideNav from "../../../Components/Nav/SideNav";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../../enums";
import CategoryForm from "../../../Components/Forms/CategoryForm";
import { Select } from "antd";
import { getCategories } from "../../../API/Category";
import get from "lodash/get";
import { createSub, getSubs, deleteSub } from "../../../API/Sub";
import LocalSearch from "../../../Components/Forms/LocalSearch";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { print, toastError, toastSuccess } from "../../../utils";

const CreateSub = (props) => {
    const { user, setSideNav, setLoading, setHeader } = props;

    const [formData, setFormData] = React.useState({
        parent_name: "",
        name: "",
        search: "",
    });
    const { name, parent_name, search } = formData;

    const [subs, setSubs] = React.useState([]);

    const [parentChoices, setParentChoices] = React.useState([]);

    const listSubs = React.useCallback(async () => {
        setLoading(true);
        await getSubs()
            .then(({ data }) => setSubs([...data]))
            .catch(print);
        setLoading(false);
    }, [setLoading]);

    const listCategories = React.useCallback(async () => {
        setLoading(true);
        await getCategories()
            .then(({ data }) => {
                if (data && Array.isArray(data) && data.length) {
                    setParentChoices([
                        ...data.map((i) => (
                            <Select.Option key={i._id} value={i.slug}>
                                {i.name}
                            </Select.Option>
                        )),
                    ]);
                }
            })
            .catch(print);
        setLoading(false);
    }, [setLoading]);

    React.useEffect(() => {
        listCategories();
        listSubs();
    }, [listCategories, listSubs]);

    React.useEffect(() => {
        const path = window.location.pathname;
        setSideNav(Object.keys(URLS).find((key) => URLS[key] === path) || "");
        setHeader("ADMIN_DASHBOARD");
    }, [setSideNav, setHeader]);

    const onDeleteSub = async (slug, sub_name) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${sub_name}?`
        );
        if (confirmDelete) {
            setLoading(true);
            await deleteSub(slug, get(user, "token", ""))
                .then((res) => {
                    toastSuccess(`${get(res, "data.name")} deleted`);
                    listSubs();
                })
                .catch(toastError);
            setLoading(false);
        }
    };

    const onChange = (e) => {
        const name = get(e, "target.name", "");
        const value = get(e, "target.value", "");
        if (!name) return;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onSubmit = async () => {
        setLoading(true);
        await createSub(name, parent_name, get(user, "token", ""))
            .then(({ data }) => {
                setFormData({ ...formData, name: "" });
                toastSuccess(`"${data.name}" is created`);
                listSubs();
            })
            .catch(toastError);
        setLoading(false);
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
                    <h4>Create sub category</h4>

                    <div className="form-group col-sm-4">
                        <br />
                        <label>Parent category</label>
                        <Select
                            style={{ width: "100%" }}
                            onChange={(e) =>
                                onChange({
                                    target: { name: "parent_name", value: e },
                                })
                            }
                        >
                            {parentChoices}
                        </Select>
                    </div>

                    <CategoryForm
                        name={name}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        disableButton={!(name && parent_name)}
                    />

                    <div className="col-sm-6">
                        <LocalSearch search={search} onChange={onChange} />

                        {subs.filter(filtering).map(({ _id, name, slug }) => (
                            <div className="alert alert-secondary" key={_id}>
                                {name}
                                <span
                                    id={slug}
                                    onClick={() => onDeleteSub(slug, name)}
                                    className="btn btn-sm float-right"
                                >
                                    <DeleteOutlined className="text-warning" />
                                </span>
                                <Link
                                    to={URLS.ADMIN_SUBCATEGORY.replace(
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

CreateSub.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateSub);
