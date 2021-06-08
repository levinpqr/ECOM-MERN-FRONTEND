import React from "react";
import { Button } from "antd";
import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { URLS, REDUX } from "../../enums";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils";
import { Link, Redirect } from "react-router-dom";
import { loginAPI } from "../../API/Login";
import get from "lodash/get";

const Login = (props) => {
    const { history, setLoading, setUser, user, setHeader } = props;

    React.useEffect(() => {
        setHeader("LOGIN");
    }, []);

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const onChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const redirectedFrom = get(history, "location.state.from");

    const handleRedirect = (usr) => {
        if (redirectedFrom) return history.push(redirectedFrom);
        history.push(get(URLS, get(usr, "role.login_redirect", "HOME"), "/"));
    };

    const onLogin = async () => {
        let errors = [];
        if (!email || !validateEmail(email))
            errors.push("Invalid email address");
        if (password.length < 6) errors.push("Password is invalid");
        if (errors.length) {
            toast.error(errors[0]);
            return;
        }
        setLoading(true);
        await auth
            .signInWithEmailAndPassword(email, password)
            .then(async ({ user }) => {
                console.log("LOGIN RESULT", user);
                const idToken = await user.getIdTokenResult();
                await loginAPI(idToken.token).then(({ data }) => {
                    setUser({
                        email: user.email,
                        token: idToken.token,
                        name: data.name,
                        role: data.role,
                        _id: data._id,
                    });
                    setLoading(false);
                    handleRedirect(data);
                });
            })
            .catch((e) => {
                console.log("LOGIN ERROR", e);
                toast.error("Invalid credentials");
                setLoading(false);
            });
    };

    const onLoginGoogle = async () => {
        setLoading(true);
        await auth
            .signInWithPopup(googleAuthProvider)
            .then(async ({ user }) => {
                const { token } = await user.getIdTokenResult();
                await loginAPI(token).then(({ data }) => {
                    setUser({
                        email: user.email,
                        token: token,
                        name: data.name,
                        role: data.role,
                        _id: data._id,
                    });
                    setLoading(false);
                    handleRedirect(data);
                });
            })
            .catch((e) => {
                console.log(e);
                toast.error(e.message);
                setLoading(false);
            });
    };

    if (user && user.token && !redirectedFrom) {
        return <Redirect to={URLS.HOME} />;
    }

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Sign In</h4>
                    <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={onChange}
                        placeholder="Enter your email address"
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
                        placeholder="Enter your password"
                        required
                    />
                    <br />
                    <Button
                        onClick={onLogin}
                        type="primary"
                        className="mb-3"
                        block
                        shape="round"
                        icon={<MailOutlined />}
                        size="large"
                        color="#1890ff"
                    >
                        Login with Email/Password
                    </Button>
                    <Button
                        onClick={onLoginGoogle}
                        type="danger"
                        className="mb-3"
                        block
                        shape="round"
                        icon={<GoogleOutlined />}
                        size="large"
                    >
                        Login with Google
                    </Button>
                    <Link
                        to="/forgot/password"
                        className="float-right text-danger"
                    >
                        Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    setHeader: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    user: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setUser: (payload) => dispatch({ type: REDUX.LOGGED_IN, payload }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
