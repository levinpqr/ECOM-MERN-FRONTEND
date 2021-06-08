import React from "react";
import PropTypes from "prop-types";
import { Button, Select, InputNumber } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { REDUX, SHIPPING_CHOICES } from "../../enums";
import {
    getAllProductColors,
    getAllProductBrands,
    getAllProducts,
} from "../../API/Product";
import { getCategories } from "../../API/Category";
import { uploadImage, removeImage } from "../../API/Cloudinary";
import { getSubs } from "../../API/Sub";
import { print, toastError, isNonEmptyArray, toastSuccess } from "../../utils";
import get from "lodash/get";
import { toast } from "react-toastify";
import FileUploader from "./FileUploader";

const initForm = {
    title: "",
    description: "",
    price: "0",
    shipping: "",
    quantity: "0",
    color: "",
    brand: "",
    category: "",
    subs: [],
};

const ProductForm = (props) => {
    const { user, onSubmit, setLoading, isEditingSlug, handleRedirect } = props;

    const [imageFiles, setImageFiles] = React.useState([]);
    const [initImages, setInitImages] = React.useState([]); // for editing only
    const [formData, setFormData] = React.useState({
        ...initForm,
        categories: [],
        subsChoices: [],
        images: [],
        colors: [],
        brands: [],
    });

    const {
        title,
        description,
        price,
        categories,
        category,
        subs,
        subsChoices,
        shipping,
        quantity,
        // images,
        colors,
        brands,
        color,
        brand,
    } = formData;

    const fetchSubCategories = React.useCallback(
        async (parent_id) => {
            setLoading(true);
            const subsRes = await getSubs({ parent: parent_id });
            const subs = get(subsRes, "data", []);
            setLoading(false);
            return subs;
        },
        [setLoading]
    );

    const initialize = React.useCallback(async () => {
        setLoading(true);
        let colors = [];
        let categories = [];
        let brands = [];
        const clrs = await getAllProductColors({}).catch(print);
        const categs = await getCategories().catch(print);
        const brds = await getAllProductBrands({}).catch(print);
        if (clrs) colors = get(clrs, "data", []);
        if (categs) categories = get(categs, "data", []);
        if (brds) brands = get(brds, "data", []);
        if (isEditingSlug) {
            const filter = { where: { slug: isEditingSlug }, limit: 1 };
            const prod = await getAllProducts(filter).catch(toastError);
            if (prod && isNonEmptyArray(prod.data)) {
                const currProduct = prod.data[0];
                const currSubsChoices = await fetchSubCategories(
                    currProduct.category._id
                );
                setFormData((fd) => ({
                    ...fd,
                    title: currProduct.title,
                    description: currProduct.description,
                    price: currProduct.price.toString(),
                    category: currProduct.category._id,
                    subs: currProduct.subs
                        ? currProduct.subs.map((i) => i._id)
                        : [],
                    shipping: currProduct.shipping,
                    quantity: currProduct.quantity.toString(),
                    color: currProduct.color._id,
                    brand: currProduct.brand._id,
                    categories,
                    colors,
                    brands,
                    subsChoices: currSubsChoices,
                }));

                if (isNonEmptyArray(currProduct.images)) {
                    const imgs = currProduct.images.map((i) => ({
                        details: { ...i },
                        url: i.url,
                        exists: true,
                    }));
                    setImageFiles([...imgs]);
                    setInitImages([...imgs]);
                }
            } else {
                toast.error("Failed to load product");
            }
        } else {
            setFormData((fd) => ({ ...fd, colors, categories, brands }));
        }
        setLoading(false);
    }, [setLoading, setFormData, isEditingSlug, fetchSubCategories]);

    React.useEffect(() => {
        initialize();
    }, [initialize]);

    const onChange = async (e) => {
        const name = get(e, "target.name", "");
        let value = get(e, "target.value");
        if (!name) return;
        let fData = formData;
        if (["quantity", "price"].includes(name)) {
            if (!value) value = "0";
            if (isNaN(value)) value = formData[name];
            else if (name === "quantity") value = parseInt(value).toString();
            else if (name === "price")
                value = (Math.round(parseFloat(value) * 100) / 100).toString();
        }
        if (name === "category" && value !== category) {
            const subs = await fetchSubCategories(value);
            fData["subsChoices"] = subs;
            fData["subs"] = [];
        }
        setFormData({ ...fData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        let images = [];
        for (let imgFile of imageFiles) {
            if (isEditingSlug && imgFile.exists) {
                images.push({ ...imgFile.details });
                continue;
            }
            const res = await uploadImage(imgFile.base64, user.token).catch(
                toastError
            );
            const { lastModified, name, path, size, type } = imgFile.details;
            images.push({
                ...get(res, "data", {}),
                lastModified,
                name,
                path,
                size,
                type,
            });
        }
        const success = await onSubmit(
            {
                title,
                description,
                price: price ? parseFloat(price) : 0,
                quantity: quantity ? parseInt(quantity) : 0,
                shipping,
                color,
                brand,
                category,
                subs,
                images,
            },
            isEditingSlug
        );
        if (success) {
            toastSuccess(
                isEditingSlug ? `Product updated` : `Product created.`
            );
            setFormData({
                ...formData,
                ...initForm,
            });
            if (isEditingSlug) {
                let imagesToDelete = [];
                for (let initImage of initImages) {
                    const wasRemoved = !images.some(
                        (i) => i.public_id === initImage.details.public_id
                    );
                    if (wasRemoved)
                        imagesToDelete.push(initImage.details.public_id);
                }
                for (let delImage of imagesToDelete) {
                    await removeImage(delImage, user.token).catch(print);
                }
                setLoading(false);
                setInitImages([]);
                handleRedirect();
            }
            setImageFiles([]);
        }
        setLoading(false);
    };

    return (
        <div className="form-group col-sm-4">
            <label>Title</label>
            <input
                name="title"
                type="text"
                className="form-control"
                onChange={onChange}
                value={title}
                required
            />
            <br />
            <label>Description</label>
            <textarea
                name="description"
                type="text"
                className="form-control"
                style={{ resize: "none" }}
                onChange={onChange}
                value={description}
                rows={3}
                required
            />
            <br />
            <label>Price</label>
            <InputNumber
                min={0}
                onChange={(e) =>
                    onChange({
                        target: { name: "price", value: e },
                    })
                }
                formatter={(value) =>
                    `P ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\P\s?|(,*)/g, "")}
                value={price}
                style={{ width: "100%" }}
            />
            <br />
            <br />
            <label>Shipping</label>
            <Select
                style={{ width: "100%" }}
                onChange={(e) =>
                    onChange({
                        target: { name: "shipping", value: e },
                    })
                }
                value={shipping}
            >
                {SHIPPING_CHOICES.map((i) => (
                    <Select.Option key={i} value={i}>
                        {i}
                    </Select.Option>
                ))}
            </Select>
            <br />
            <br />
            <label>Quantity</label>
            <br />
            <InputNumber
                min={0}
                onChange={(e) =>
                    onChange({
                        target: { name: "quantity", value: e },
                    })
                }
                value={quantity}
                style={{ width: "100%" }}
            />
            <br />
            <br />
            <label>Color</label>
            <Select
                style={{ width: "100%" }}
                onChange={(e) =>
                    onChange({
                        target: { name: "color", value: e },
                    })
                }
                value={color}
            >
                {colors.map((i) => (
                    <Select.Option key={i.value} value={i._id}>
                        {i.label}
                    </Select.Option>
                ))}
            </Select>
            <br />
            <br />
            <label>Brand</label>
            <Select
                style={{ width: "100%" }}
                onChange={(e) =>
                    onChange({
                        target: { name: "brand", value: e },
                    })
                }
                value={brand}
            >
                {brands.map((i) => (
                    <Select.Option key={i.value} value={i._id}>
                        {i.label}
                    </Select.Option>
                ))}
            </Select>
            <br />
            <br />
            <label>Categories</label>
            <Select
                style={{ width: "100%" }}
                onChange={(e) =>
                    onChange({
                        target: { name: "category", value: e },
                    })
                }
                value={category}
            >
                {categories.map((i) => (
                    <Select.Option key={i._id} value={i._id}>
                        {i.name}
                    </Select.Option>
                ))}
            </Select>
            <br />
            <br />
            {category && (
                <>
                    <label>Subcategories</label>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        onChange={(e) =>
                            onChange({
                                target: { name: "subs", value: e },
                            })
                        }
                        value={subs}
                    >
                        {subsChoices.map((i) => (
                            <Select.Option key={i._id} value={i._id}>
                                {i.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <br />
                    <br />
                </>
            )}
            <FileUploader files={imageFiles} setFiles={setImageFiles} />
            <br />
            <Button
                onClick={handleSubmit}
                type="primary"
                className="mb-3"
                shape="round"
                color="#1890ff"
                icon={<EditOutlined />}
                disabled={
                    !title ||
                    !description ||
                    !price ||
                    !shipping ||
                    !quantity ||
                    !color ||
                    !brand ||
                    !category ||
                    !subs.length
                }
            >
                Submit
            </Button>
        </div>
    );
};

ProductForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    isEditingSlug: PropTypes.string,
    handleRedirect: PropTypes.func,
};

const mapStateTopProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
});

export default connect(mapStateTopProps, mapDispatchToProps)(ProductForm);
