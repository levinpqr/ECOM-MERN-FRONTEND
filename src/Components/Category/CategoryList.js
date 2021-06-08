import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { URLS } from "../../enums";
import { getCategories } from "../../API/Category";
import { isNonEmptyArray, toastError } from "../../utils";

const CategoryList = () => {
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);

    const initialize = React.useCallback(async () => {
        setLoading(true);
        const res = await getCategories().catch(toastError);
        if (res && isNonEmptyArray(res.data)) setCategories([...res.data]);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <div className="container">
            <div className="row" style={{ justifyContent: "center" }}>
                {loading ? (
                    <Spin />
                ) : (
                    categories.map((i) => (
                        <Link
                            key={i._id}
                            to={URLS.CATEGORY.replace(":slug", i.slug)}
                            className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
                        >
                            <span style={{ color: "#1890ff" }}>{i.name}</span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

CategoryList.propTypes = {};

export default CategoryList;
