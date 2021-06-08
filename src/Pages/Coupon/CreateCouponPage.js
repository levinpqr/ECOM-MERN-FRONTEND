import React from "react";
import PropTypes from "prop-types";
import SideNav from "../../Components/Nav/SideNav";
import { connect } from "react-redux";
import { REDUX } from "../../enums";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import get from "lodash/get";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { createCoupon, deleteCoupon, listCoupons } from "../../API/Coupon";
import { isNonEmptyArray, toastError, toastSuccess } from "../../utils";

const CreateCouponPage = (props) => {
    const { setSideNav, setHeader, setLoading, user } = props;

    const [formDate, setFormData] = React.useState({
        name: "",
        discount: "0",
        expiry: new Date(),
    });
    const { name, discount, expiry } = formDate;

    const [coupons, setCoupons] = React.useState([]);

    const getCoupons = React.useCallback(
        async (filters) => {
            setLoading(true);
            const res = await listCoupons(filters).catch((e) => toastError(e));
            if (res && Array.isArray(res.data)) setCoupons([...res.data]);
            setLoading(false);
        },
        [setLoading, listCoupons]
    );

    React.useEffect(() => {
        setSideNav("ADMIN_COUPONS");
        setHeader("ADMIN_DASHBOARD");
        getCoupons({ sort: { createdAt: -1 } });
    }, [setSideNav, setHeader, getCoupons]);

    const onChange = (e) => {
        const targetName = get(e, "target.name");
        const targetValue = get(e, "target.value");
        setFormData({ ...formDate, [targetName]: targetValue });
    };

    const onSubmit = async () => {
        let discountData = parseFloat(discount);
        console.log(name, discount, discountData, expiry);
        if (
            isNaN(discount) ||
            isNaN(discountData) ||
            !isFinite(discountData) ||
            discountData > 100 ||
            discountData < 0
        ) {
            toastError({ "response.data.err": "Invalid discount value" });
            return;
        }
        setLoading(true);
        const res = await createCoupon(
            { name, discount, expiry },
            user.token
        ).catch((e) => toastError(e));
        setLoading(false);
        if (res) {
            getCoupons({ sort: { createdAt: -1 } });
            setFormData({
                name: "",
                discount: "0",
                expiry: new Date(),
            });
            toastSuccess("Coupon created");
        }
    };

    const handleRemove = async (id, name) => {
        const conf = window.confirm("Delete coupon " + name);
        if (!conf) return;
        setLoading(true);
        const res = await deleteCoupon(id, user.token).catch(toastError);
        if (res) {
            toastSuccess("Coupon removed");
            getCoupons({ sort: { createdAt: -1 } });
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <SideNav />
                </div>
                <div
                    className="col-md-3"
                    style={{ marginLeft: 20, marginTop: 10 }}
                >
                    <h4>Coupon</h4>
                    <br />
                    <div className="form-group">
                        <label className="text-muted">Name</label>
                        <input
                            name="name"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={name}
                            required
                        />
                    </div>
                    <br />

                    <div className="form-group">
                        <label className="text-muted">Discount %</label>
                        <input
                            name="discount"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={discount}
                            required
                        />
                    </div>
                    <br />

                    <div className="form-group">
                        <label className="text-muted">Expiry</label>
                        <br />
                        <DatePicker
                            className="form-control"
                            selected={expiry}
                            value={expiry}
                            onChange={(value) =>
                                onChange({ target: { name: "expiry", value } })
                            }
                            required
                        />
                    </div>
                    <br />

                    <Button
                        onClick={onSubmit}
                        type="primary"
                        className="mb-3"
                        shape="round"
                        color="#1890ff"
                        icon={<EditOutlined />}
                        disabled={!name || !expiry || !discount}
                    >
                        Submit
                    </Button>
                    <br />
                    <br />

                    <h4>{coupons.length} Coupon/s</h4>

                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Expiry</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.name}</td>
                                    <td>
                                        {new Date(
                                            c.expiry
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>{c.discount}%</td>
                                    <td style={{ textAlign: "center" }}>
                                        <DeleteOutlined
                                            className="text-danger pointer"
                                            onClick={() =>
                                                handleRemove(c._id, c.name)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

CreateCouponPage.propTypes = {
    user: PropTypes.object,
    setLoading: PropTypes.func.isRequired,
    setSideNav: PropTypes.func.isRequired,
    setHeader: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
    setSideNav: (nav) =>
        dispatch({ type: REDUX.SET_USERSIDENAV, payload: nav }),
    setHeader: (key) => dispatch({ type: REDUX.SET_HEADER, payload: key }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateCouponPage);
