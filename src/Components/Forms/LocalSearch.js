import React from "react";
import PropTypes from "prop-types";

const LocalSearch = (props) => {
    const { search, onChange } = props;
    return (
        <input
            name="search"
            type="search"
            placeholder="Filter"
            value={search || ""}
            onChange={onChange}
            className="form-control mb-4"
        />
    );
};

LocalSearch.propTypes = {
    search: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default LocalSearch;
