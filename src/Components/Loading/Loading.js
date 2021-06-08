import * as React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = ({ loading }) => {
    if (!loading) return null;
    return (
        <div
            style={{
                position: "fixed",
                right: "0px",
                bottom: "0px",
                top: "0px",
                left: "0px",
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                opacity: "100%",
                width: "100%",
                height: "100%",
                zIndex: 100000000,
            }}
        >
            <div
                style={{
                    height: "100%",
                    outline: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "#1890ff",
                }}
            >
                <div className="loader center">
                    <LoadingOutlined style={{ fontSize: 150 }} spin />
                </div>
            </div>
        </div>
    );
};

Loading.propTypes = {
    loading: PropTypes.bool.isRequired,
};

export default connect((state) => ({ loading: state.loading }))(Loading);
