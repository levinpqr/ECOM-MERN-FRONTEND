import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useDropzone } from "react-dropzone";
import { REDUX } from "../../enums";
import { CloudUploadOutlined, MinusCircleFilled } from "@ant-design/icons";
import { isNonEmptyArray, getBase64Promise } from "../../utils";
import { Avatar, Row, Col } from "antd";
import { toast } from "react-toastify";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#1890ff",
    borderStyle: "dashed",
    backgroundColor: "#e4e9ed",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const activeStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const Icon = ({ imageDetails, onRemove }) => (
    <Col span={8} style={{ paddingBottom: 20 }}>
        <Avatar
            shape="square"
            size={80}
            src={
                imageDetails.exists
                    ? imageDetails.details.url
                    : imageDetails.base64
            }
        />
        <MinusCircleFilled
            style={{
                color: "#fc0324",
                fontSize: 20,
                position: "absolute",
                marginLeft: -10,
                marginTop: -12,
                cursor: "pointer",
            }}
            onClick={onRemove}
        />
    </Col>
);

const FileUploader = (props) => {
    const { setLoading, files, setFiles } = props;

    const onDrop = React.useCallback(
        async (acceptedFiles) => {
            setLoading(true);

            let tempFiles = [];
            acceptedFiles = acceptedFiles.filter((i) => {
                return !files.some(({ details }) =>
                    Boolean(
                        details.lastModified === i.lastModified &&
                            details.name === i.name &&
                            details.path === i.path &&
                            details.size === i.size &&
                            details.type === i.type
                    )
                );
            });

            for (let details of acceptedFiles) {
                const base64 = await getBase64Promise(details);
                tempFiles.push({
                    details,
                    base64,
                });
            }

            setFiles([...files, ...tempFiles]);

            setLoading(false);
        },
        [files, setLoading, setFiles]
    );

    const onDropRejected = React.useCallback(() => {
        toast.error(`Only image files are allowed`);
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: "image/*",
        onDropRejected,
    });

    const style = React.useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept]
    );

    const handleRemove = (i) => {
        setFiles((files) => {
            files.splice(i, 1);
            return [...files];
        });
    };

    return (
        <>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <CloudUploadOutlined style={{ fontSize: 30 }} />
                <span style={{ color: "#6c757d" }}>Drop files here</span>
            </div>
            <br />
            {isNonEmptyArray(files) && (
                <Row>
                    {files.map((item, i) => (
                        <Icon
                            key={i}
                            imageDetails={item}
                            onRemove={() => handleRemove(i)}
                        />
                    ))}
                </Row>
            )}
        </>
    );
};

FileUploader.propTypes = {
    setLoading: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
};

const mapStateToDispatch = (dispatch) => ({
    setLoading: (bool) => dispatch({ type: REDUX.SET_LOADING, payload: bool }),
});

export default connect(null, mapStateToDispatch)(FileUploader);
