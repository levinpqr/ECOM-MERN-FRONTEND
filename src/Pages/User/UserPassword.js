import React from "react";
import PropTypes from "prop-types";
import SideNav from "../../Components/Nav/SideNav";
import { connect } from "react-redux";
import { REDUX, URLS } from "../../enums";
import { auth, emailAuthProvider } from "../../firebase";
import get from "lodash/get";
import { toast } from "react-toastify";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { toastSuccess } from "../../utils";

const UserPassword = (props) => {
    const { setSideNav, setLoading, loading, user, setHeader } = props;

    const [canSubmit, setCanSubmit] = React.useState(false);

    const [formData, setFormData] = React.useState({
        password: "",
        confPassword: "",
        oldPassword: "",
    });

    let hasPassword = false;
    const usrData = get(auth, "currentUser.providerData", undefined);
    if (usrData && Array.isArray(usrData)) {
        hasPassword = usrData.some((i) => i.providerId === "password");
    }

    const { password, confPassword, oldPassword } = formData;

    React.useEffect(() => {
        let incompleteCount = 0;
        if (hasPassword && !oldPassword) incompleteCount++;
        if (!password || !confPassword) incompleteCount++;
        if (incompleteCount) setCanSubmit(false);
        else setCanSubmit(true);
    }, [password, confPassword, oldPassword, hasPassword]);

    React.useEffect(() => {
        if (user) {
            setHeader(get(user, "role.dashboard_redirect", ""));
        }
    }, [user]);

    const onChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = async () => {
        setLoading(true);
        if (password !== confPassword) {
            toast.error("Passwords do not match");
            return setLoading(false);
        }
        if (password.length < 6) {
            toast.error("Password should contain at least 6 characters");
            return setLoading(false);
        }
        if (hasPassword) {
            try {
                const credentials = emailAuthProvider.credential(
                    get(auth, "currentUser.email", ""),
                    oldPassword
                );
                await auth.currentUser.reauthenticateWithCredential(
                    credentials
                );
            } catch (e) {
                toast.error("Invalid credentials");
                console.log(e);
                setLoading(false);
                return;
            }
        }
        await auth.currentUser
            .updatePassword(password)
            .then(() => {
                toastSuccess("Password updated!");
                hasPassword = true;
                setFormData({
                    password: "",
                    confPassword: "",
                    oldPassword: "",
                });
            })
            .catch((e) => {
                console.log(e);
                toast.error(e.message || "Failed");
            });
        setLoading(false);
    };

    React.useEffect(() => {
        const path = window.location.pathname;
        setSideNav(Object.keys(URLS).find((key) => URLS[key] === path) || "");
    }, [setSideNav]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div className="col">
                    <br />
                    <h4>
                        {loading
                            ? ""
                            : hasPassword
                            ? "Update Password"
                            : "Create Password"}
                    </h4>
                    <form>
                        <div className="form-group col-sm-4">
                            {hasPassword && (
                                <>
                                    <br />
                                    <input
                                        name="oldPassword"
                                        type="password"
                                        onChange={onChange}
                                        className="form-control"
                                        placeholder="Enter your old password"
                                        value={oldPassword}
                                    />
                                </>
                            )}
                            <br />
                            <input
                                name="password"
                                type="password"
                                onChange={onChange}
                                className="form-control"
                                placeholder="Enter new password"
                                value={password}
                            />
                            <br />
                            <input
                                name="confPassword"
                                type="password"
                                onChange={onChange}
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confPassword}
                            />
                            <br />
                            <Button
                                onClick={onSubmit}
                                type="primary"
                                className="mb-3"
                                shape="round"
                                color="#1890ff"
                                icon={<EditOutlined />}
                                disabled={!canSubmit}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

UserPassword.propTypes = {
    user: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
    setSideNav: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    setHeader: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setSideNav: (nav) =>
        dispatch({ type: REDUX.SET_USERSIDENAV, payload: nav }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPassword);
