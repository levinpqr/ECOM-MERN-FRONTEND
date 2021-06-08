import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const CategoryForm = (props) => {
    const { name, onChange, onSubmit, disableButton } = props;
    return (
        <>
            <form>
                <div className="form-group col-sm-4">
                    <br />
                    <label>Name</label>
                    <input
                        name="name"
                        type="text"
                        className="form-control"
                        onChange={onChange}
                        value={name}
                        required
                    />
                    <br />
                    <Button
                        onClick={onSubmit}
                        type="primary"
                        className="mb-3"
                        shape="round"
                        color="#1890ff"
                        icon={<EditOutlined />}
                        disabled={!name || disableButton}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </>
    );
};

CategoryForm.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disableButton: PropTypes.bool,
};

export default CategoryForm;
