import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { URLS } from "../../enums";
import get from "lodash/get";

const RatingModal = (props) => {
    const { user, onRateProduct, children } = props;

    const [isVisible, setIsVisible] = React.useState(false);

    const history = useHistory();
    const params = useParams();

    const handleModal = () => {
        if (get(user, "token")) {
            setIsVisible(true);
        } else {
            history.push({
                pathname: URLS.LOGIN,
                state: {
                    from: URLS.PRODUCT_VIEW.replace(
                        ":slug",
                        get(params, "slug", "")
                    ),
                },
            });
        }
    };

    return (
        <>
            <div onClick={handleModal}>
                <StarOutlined className="text-danger" />
                <br /> {user ? "Leave rating" : "Login to leave rating"}
            </div>
            <Modal
                title="Leave your rating"
                centered
                visible={isVisible}
                onOk={() => {
                    setIsVisible(false);
                    onRateProduct();
                }}
                onCancel={() => setIsVisible(false)}
            >
                {children}
            </Modal>
        </>
    );
};

RatingModal.propTypes = {
    user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, null)(RatingModal);
