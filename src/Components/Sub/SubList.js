import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { URLS } from "../../enums";
import { listSubs } from "../../API/Sub";
import { isNonEmptyArray, toastError } from "../../utils";

const SubList = () => {
    const [loading, setLoading] = React.useState(false);
    const [subs, setSubs] = React.useState([]);

    const initialize = React.useCallback(async () => {
        setLoading(true);
        const res = await listSubs().catch(toastError);
        if (res && isNonEmptyArray(res.data)) setSubs([...res.data]);
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
                    subs.map((i) => (
                        <Link
                            key={i._id}
                            to={URLS.SUBCATEGORY.replace(":slug", i.slug)}
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

SubList.propTypes = {};

export default SubList;
