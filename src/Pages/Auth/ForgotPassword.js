import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { connect } from "react-redux";
import { toastSuccess, validateEmail } from "../../utils";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { URLS, REDUX } from "../../enums";
import { Redirect } from "react-router-dom";

import { MailOutlined } from "@ant-design/icons";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ForgotPassword = (props) => {
    const { setLoading, user, setHeader } = props;
    const [email, setEmail] = React.useState("");

    React.useEffect(() => {
        setHeader("LOGIN");
    }, [setHeader]);

    const onSubmit = async () => {
        if (!email || !validateEmail(email)) {
            toast.error("Invalid email");
            return;
        }
        setLoading(true);
        const res = await auth.fetchSignInMethodsForEmail(email);
        if (!res || !res.length) {
            toast.error(`No users found with this email address`);
            setLoading(false);
            return;
        }
        await auth
            .sendPasswordResetEmail(email, {
                url: BASE_URL + URLS.LOGIN,
                handleCodeInApp: true,
            })
            .then(() => {
                setEmail("");
                toastSuccess("Reset password sent. Please check your email.");
            })
            .catch((e) => {
                console.log(e);
                toast.error(e.message);
            });
        setLoading(false);
    };

    if (user && user.token) {
        return <Redirect to={URLS.HOME} />;
    }

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Forgot Password</h4>
                    <br />

                    <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={({ target: { value } }) => setEmail(value)}
                        placeholder="Enter your email address"
                        required
                    />
                    <small>Send a reset password to your email address.</small>
                    <br />
                    <br />
                    <Button
                        onClick={onSubmit}
                        type="primary"
                        className="mb-3"
                        block
                        shape="round"
                        icon={<MailOutlined />}
                        size="large"
                        color="#1890ff"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

ForgotPassword.propTypes = {
    setLoading: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
