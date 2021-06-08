import React from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import { isNonEmptyArray } from "../../utils";
import noImage from "../../No Image.jpg";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { URLS } from "../../enums";

const MAX_DISPLAY_CHARS = 60;

const AdminProductCard = ({ product, handleDelete }) => {
    const { title, slug, description, images } = product;

    const [shortenedDesc, setShortenedDesc] = React.useState("");

    React.useEffect(() => {
        if (typeof description === "string") {
            const words = description.split(" ");
            let finalDesc = "";
            for (let word of words) {
                if (finalDesc.length + word.length + 1 > MAX_DISPLAY_CHARS) {
                    finalDesc = `${finalDesc}....`;
                    break;
                }
                finalDesc = `${finalDesc} ${word}`;
            }
            setShortenedDesc(finalDesc);
        }
    }, [description]);

    return (
        <Card
            cover={
                <img
                    src={isNonEmptyArray(images) ? images[0].url : noImage}
                    style={{
                        height: "200px",
                        objectFit: "cover",
                    }}
                    className="p-1"
                    alt={title}
                />
            }
            hoverable
            actions={[
                <Link to={URLS.ADMIN_PRODUCT_UPDATE.replace(":slug", slug)}>
                    <EditOutlined
                        className="text-warning"
                        style={{ fontSize: 19 }}
                    />
                </Link>,
                <DeleteOutlined
                    className="text-danger"
                    style={{ fontSize: 18 }}
                    onClick={() => handleDelete(title, slug, images)}
                />,
            ]}
        >
            <Card.Meta title={title} description={shortenedDesc} />
        </Card>
    );
};

AdminProductCard.propTypes = {
    handleDelete: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
};

export default AdminProductCard;
