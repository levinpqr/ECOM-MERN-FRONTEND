import React from "react";
import PropTypes from "prop-types";
import Typewriter from "typewriter-effect";

const Jumbotron = ({ text }) => (
    <Typewriter
        options={{
            strings: text,
            autoStart: true,
            loop: true,
            cursor: `<span style="color: #03a9f4;">|</span>`
        }}
    />
);

Jumbotron.propTypes = {
    text: PropTypes.array.isRequired,
};

export default Jumbotron;
