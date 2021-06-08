import React from "react";
import PropTypes from "prop-types";
import StarRating from "react-star-ratings";
import { Button, Tooltip } from "antd";
import { ClearOutlined } from "@ant-design/icons";

const StarFilter = (props) => {
    const { starClick, currentValue } = props;
    return (
        <div style={{ marginTop: "-10px" }}>
            <div className="pr-4 pl-4 pb-3">
                {[5, 4, 3, 2, 1].map((i) => (
                    <React.Fragment key={i}>
                        <StarRating
                            changeRating={() => starClick(i)}
                            numberOfStars={i}
                            starDimension="20px"
                            starSpacing="4px"
                            starHoverColor="#03a9f4"
                            starEmptyColor={
                                currentValue === i ? "#03a9f4" : "#65caf7"
                            }
                        />
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

StarFilter.propTypes = {
    starClick: PropTypes.func.isRequired,
    currentValue: PropTypes.number,
};

export default StarFilter;
