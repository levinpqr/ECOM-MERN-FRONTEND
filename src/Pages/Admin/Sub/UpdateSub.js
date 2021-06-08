import React from "react";
import PropTypes from "prop-types";
import SideNav from "../../../Components/Nav/SideNav";
import get from "lodash/get";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../../enums";
import { getSub, updateSub } from "../../../API/Sub";
import { getCategories } from "../../../API/Category";
import CategoryForm from "../../../Components/Forms/CategoryForm";
import { Select } from "antd";
import { print, toastError, toastSuccess } from "../../../utils";

const UpdateCategory = (props) => {
    const { user, setSideNav, setLoading, match, history, setHeader } = props;

    const [formData, setFormData] = React.useState({
        name: "",
        parent_name: "",
    });
    const [parentChoices, setParentChoices] = React.useState([]);
    const [allParents, setAllParents] = React.useState([]);

    const { name, parent_name } = formData;

    const onChange = (e) => {
        setFormData({
            ...formData,
            [get(e, "target.name")]: get(e, "target.value"),
        });
    };

    const onSubmit = async () => {
        setLoading(true);

        const parent_id = get(
            allParents.find((i) => i.slug === parent_name),
            "_id"
        );
        await updateSub(
            get(match, "params.slug", undefined),
            name,
            parent_id,
            get(user, "token")
        )
            .then(() => {
                toastSuccess("Category updated");
                history.push(URLS.ADMIN_SUBCATEGORIES);
            })
            .catch(toastError);
        setLoading(false);
    };

    const initialize = React.useCallback(async () => {
        setLoading(true);
        // to-do NOT FOUND PAGE

        await getCategories()
            .then(async ({ data }) => {
                if (data && Array.isArray(data) && data.length) {
                    setAllParents([...data]);
                    setParentChoices([
                        ...data.map((i) => (
                            <Select.Option key={i._id} value={i.slug}>
                                {i.name}
                            </Select.Option>
                        )),
                    ]);
                    await getSub(get(match, "params.slug", undefined))
                        .then((resp) => {
                            const subData = get(resp, "data");
                            const parent_id = get(subData, "parent", "");
                            const parent_name = get(
                                data.find((i) => i._id === parent_id),
                                "slug"
                            );
                            setFormData((obj) => {
                                return {
                                    ...obj,
                                    parent_name,
                                    name: get(subData, "name", ""),
                                };
                            });
                        })
                        .catch(print);
                }
            })
            .catch(print);
        setLoading(false);
    }, [setLoading, match]);

    React.useEffect(() => {
        initialize();
        setSideNav("ADMIN_SUBCATEGORIES");
        setHeader("ADMIN_DASHBOARD");
    }, [initialize, setSideNav]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <br />
                    <h4>Update sub category</h4>

                    <div className="form-group col-sm-4">
                        <br />
                        <label>Parent category</label>
                        <Select
                            value={parent_name}
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
