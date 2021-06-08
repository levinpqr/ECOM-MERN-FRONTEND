import React from "react";
import PropTypes from "prop-types";
import { validateEmail } from "../../utils";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import get from "lodash/get";
import { URLS, REDUX } from "../../enums";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { loginAPI } from "../../API/Login";

const RegisterComplete = (props) => {
    const { history, setLoading, setUser, setHeader } = props;
    const [formData, setFormData] = React.useState({
        email: "",
        name: "",
        password: "",
        confPassword: "",
    });

    const { email, name, password, confPassword } = formData;

    React.useEffect(() => {
        if (!email) {
            setFormData({
                ...formData,
                email: window.localStorage.getItem("emailForRegistration"),
            });
        }
        setHeader("REGISTER");
    }, [email, formData, setHeader]);

    const onChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = async () => {
        let errors = [];
        console.log(formData);
        if (!validateEmail(email)) errors.push("Email is invalid");
        if (!password) errors.push("Password is required");
        if (!confPassword) errors.push("Confirm Password is required");
        if (password.length < 6)
            errors.push("Password should be no less then 6 characters");
        if (password !== confPassword) errors.push("Passwords do not match");
        if (errors.length) {
            toast.error(errors[0]);
            return;
        }
        setLoading(true);
        await auth
            .signInWithEmailLink(email, window.location.href)
            .then(async (result) => {
                if (get(result, "user.emailVerified")) {
                    window.localStorage.removeItem("emailForRegistration");
                    // user is stored in auth instance, get it:
                    let user = auth.currentUser;
                    await user.updatePassword(password);
                    const idToken = await user.getIdTokenResult();
                    const { data } = await loginAPI(idToken.token, { name });
                    setUser({
                        email: user.email,
                        token: idToken.token,
                        name: data.name,
                        role: data.role,
                        _id: data._id,
                    });
                    history.push(URLS.HOME);
                } else {
                    throw Error("EMAIL NOT VERIFIED");
                }
            })
            .catch((e) => {
                console.log(e);
                toast.error(e.message);
            });
        setLoading(false);
    };

    const canProceed = Boolean(
        email && password && confPassword && validateEmail(email)
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Complete Registration</h4>
                    <form>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={onChange}
                            placeholder="Enter your email address"
                            disabled
                            required
                        />
                        <br />
                        <input
                            name="name"
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={onChange}
                            placeholder="Display Name"
                            required
                        />
                        <br />
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={onChange}
                            autoFocus
                            placeholder="Password"
                            required
                        />
                        <br />
                        <input
                            name="confPassword"
                            type="password"
                            className="form-control"
                            value={confPassword}
                            onChange={onChange}
                            autoFocus
                            placeholder="Confirm Password"
                            required
                        />
                        <br />
                        <Button
                            onClick={onSubmit}
                            type="primary"
                            className="mb-3"
                            block
                            shape="round"
                            icon={<UserOutlined />}
                            size="large"
                            color="#1890ff"
                            disabled={!canProceed}
                        >
                            Complete Registration
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

RegisterComplete.propTypes = {
    setLoading: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setUser: (payload) => dispatch({ type: REDUX.LOGGED_IN, payload }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(null, mapDispatchToProps)(RegisterComplete);
