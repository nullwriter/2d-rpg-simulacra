import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

function DialogItem({ content, selectedChoice = 0 }) {
  const isObject = typeof content === "object";

  return !isObject ? <p className="Dialog__text">{content}</p> : (
    <>
      <p className="Dialog__text">{content.text}</p>
      {content.choices ? (<ul className="Dialog__text">{content.choices.map((choice, index) => (
        <li key={index} className={cn("Dialog__choice", { "Dialog__choice--selected": selectedChoice === index })}>{choice.text}</li>
      ))}</ul>) : null}
    </>
  );
}

DialogItem.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  selectedChoice: PropTypes.number
};

export default DialogItem;
