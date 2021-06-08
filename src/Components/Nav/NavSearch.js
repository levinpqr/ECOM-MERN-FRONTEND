import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input } from "antd";
import { REDUX, URLS } from "../../enums";
import get from "lodash/get";
import { useHistory } from "react-router-dom";

const NavSearch = (props) => {
    const { setSearchText } = props;

    const history = useHistory();

    const onSearch = (value) => {
        const query_str = value ? `?query=${value}` : ``;
        history.push(`${URLS.SHOP}${query_str}`);
    };

    const onChange = (e) => {
        setSearchText(get(e, "target.value", ""));
    };

    return (
        <div className="form-inline my-2 my-lg-1">
            <Input.Search
                placeholder="Search"
                className=""
                onSearch={onSearch}
                enterButton
                onChange={onChange}
            />
        </div>
    );
};

NavSearch.propTypes = {
    setSearchText: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setSearchText: (text) =>
        dispatch({ type: REDUX.SEARCH_QUERY, payload: { text } }),
});

export default connect(null, mapDispatchToProps)(NavSearch);
