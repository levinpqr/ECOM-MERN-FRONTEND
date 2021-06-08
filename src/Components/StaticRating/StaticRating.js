import React from "react";
import PropTypes from "prop-types";
import StarRating from "react-star-ratings";
import { NO_RATING } from "../../enums";
import { getRatingAverage } from "../../utils";

const StaticRating = ({ product }) => {
    const [rating, setRating] = React.useState(NO_RATING);

    React.useEffect(() => {
        setRating(getRatingAverage(product));
    }, [product]);

    return (
        <div className="text-center pt-1 pb-3">
            {rating.num_raters ? (
                <span>
                    <StarRating
                        editing={false}
                        starDimension="20px"
                        starSpacing="2px"
                        starRatedColor="#03a9f4"
                        rating={rating.average}
                    />{" "}
                    ({rating.num_raters})
                </span>
            ) : (
                <div className="text-center pt-1 pb-3">No rating yet</div>
            )}
        </div>
    );
};

StaticRating.propTypes = {
    product: PropTypes.object.isRequired,
};

export default StaticRating;
