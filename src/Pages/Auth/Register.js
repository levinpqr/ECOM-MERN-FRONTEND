import React from "react";
import PropTypes from "prop-types";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { toastSuccess, validateEmail } from "../../utils";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../enums";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Register = (props) => {
    const { setLoading, user, setHeader } = props;

    React.useEffect(() => {
        setHeader("REGISTER");
    }, [setHeader]);

    const [formData, setFormData] = React.useState({
        email: "",
    });

    const { email } = formData;

    const onChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = async () => {
        const config = {
            url: BASE_URL + URLS.REGISTER_COMPLETE,
            handleCodeInApp: true,
        };
        if (!validateEmail(email)) {
            toast.error(`Email is invalid.`);
            return;
        }
        setLoading(true);
        const res = await auth.fetchSignInMethodsForEmail(email);
        if (res && res.length) {
            toast.error(`User already exists. Please login instead.`);
            setLoading(false);
            return;
        }
        await auth.sendSignInLinkToEmail(email, config);
        toastSuccess(
            `Email is sent to ${email}. Click the link to complete your registration.`
        );
        window.localStorage.setItem("emailForRegistration", email);
        setFormData({ ...formData, email: "" });
        setLoading(false);
    };

    const canProceed = Boolean(email && validateEmail(email));

    if (user && user.token) {
        return <Redirect to={URLS.HOME} />;
    }

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    <form>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={onChange}
                            autoFocus
                            placeholder="Enter your email address"
                            required
                        />
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
                            disabled={!canProceed}
                        >
                            Register
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

Register.propTypes = {
    setLoading: PropTypes.func.isRequired,
    user: PropTypes.object,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
