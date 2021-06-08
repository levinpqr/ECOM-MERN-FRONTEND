import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import RegisterComplete from "./Pages/Auth/RegisterComplete";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import Home from "./Pages/Home";
import Header from "./Components/Nav/Header";
import Loading from "./Components/Loading/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { URLS } from "./enums";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { REDUX } from "./enums";
import { getUserByToken } from "./API/Login";
import UserHistory from "./Pages/User/UserHistory";
import UserPassword from "./Pages/User/UserPassword";
import UserWishlist from "./Pages/User/UserWishlist";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateCategory from "./Pages/Admin/Category/CreateCategory";
import UpdateCategory from "./Pages/Admin/Category/UpdateCategory";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import AdminRoute from "./Components/Routes/AdminRoute";
import CreateSub from "./Pages/Admin/Sub/CreateSub";
import UpdateSub from "./Pages/Admin/Sub/UpdateSub";
import CreateProduct from "./Pages/Admin/Product/CreateProduct";
import UpdateProduct from "./Pages/Admin/Product/UpdateProduct";
import Products from "./Pages/Admin/Product/Products";
import Product from "./Pages/Product";
import CategoryHome from "./Pages/Category/CategoryHome";
import SubHome from "./Pages/Sub/SubHome";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import SlideDrawer from "./Components/Drawer/SlideDrawer";
import CreateCouponPage from "./Pages/Coupon/CreateCouponPage";

function App() {
    const dispatch = useDispatch();
    React.useEffect(() => {
        let initCart = [];
        try {
            initCart = JSON.parse(localStorage.getItem("cart"));
            if (!Array.isArray(initCart)) initCart = [];
        } catch (e) {
            console.log(e);
        }
        dispatch({
            type: REDUX.ADD_TO_CART,
            payload: initCart,
        });
        dispatch({
            type: REDUX.SET_LOADING,
            payload: true,
        });
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const idToken = await user.getIdTokenResult();
                const payload = {
                    email: user.email,
                    token: idToken.token,
                };
                await getUserByToken(idToken.token)
                    .then(({ data }) => {
                        Object.assign(payload, {
                            name: data.name,
                            role: data.role,
                            _id: data._id,
                        });
                    })
                    .catch((e) => console.log(e));
                dispatch({
                    type: REDUX.LOGGED_IN,
                    payload: payload,
                });
            }
            dispatch({
                type: REDUX.SET_LOADING,
                payload: false,
            });
        });
    }, [dispatch]);

    return (
        <>
            <Header />
            <SlideDrawer />
            <ToastContainer />
            <Loading />
            <Switch>
                <Route exact path={URLS.HOME} component={Home} />
                <Route exact path={URLS.LOGIN} component={Login} />
                <Route exact path={URLS.REGISTER} component={Register} />
                <Route exact path={URLS.PRODUCT_VIEW} component={Product} />
                <Route
                    exact
                    path={URLS.REGISTER_COMPLETE}
                    component={RegisterComplete}
                />
                <Route
                    exact
                    path={URLS.FORGOT_PASSWORD}
                    component={ForgotPassword}
                />
                <PrivateRoute
                    exact
                    path={URLS.USER_HISTORY}
                    component={UserHistory}
                />
                <PrivateRoute
                    exact
                    path={URLS.USER_PASSWORD}
                    component={UserPassword}
                />
                <PrivateRoute
                    exact
                    path={URLS.USER_WISHLIST}
                    component={UserWishlist}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_DASHBOARD}
                    component={AdminDashboard}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_CATEGORIES}
                    component={CreateCategory}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_CATEGORY}
                    component={UpdateCategory}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_SUBCATEGORIES}
                    component={CreateSub}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_SUBCATEGORY}
                    component={UpdateSub}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_PRODUCT}
                    component={CreateProduct}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_PRODUCTS}
                    component={Products}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_PRODUCT_UPDATE}
                    component={UpdateProduct}
                />
                <AdminRoute
                    exact
                    path={URLS.ADMIN_COUPONS}
                    component={CreateCouponPage}
                />
                <Route exact path={URLS.CATEGORY} component={CategoryHome} />
                <Route exact path={URLS.SUBCATEGORY} component={SubHome} />
                <Route exact path={URLS.SHOP} component={Shop} />
                <Route exact path={URLS.CART} component={Cart} />
                <PrivateRoute exact path={URLS.CHECKOUT} component={Checkout} />
            </Switch>
        </>
    );
}

export default App;
