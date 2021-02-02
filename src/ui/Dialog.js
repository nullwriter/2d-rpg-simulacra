import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { isConfirm, isArrowUp, isArrowDown } from "./UI";
import DialogItem from "./DialogItem";

function Dialog({ top = false, script }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over) {
      return;
    }

    const handler = event => {
      event.stopImmediatePropagation(); // capture keyboard events
      const hasChoices = typeof script[currentIndex] === "object" && "choices" in script[currentIndex];

      if (isConfirm(event)) {
        if (currentIndex >= script.length - 1) {
          if (hasChoices) {
            script[currentIndex].choices[selectedChoice].action();
          }

          setOver(true);
        } else {
          setCurrentIndex(index => index + 1);
        }
      } else if (hasChoices) {
        if (isArrowUp(event)) {
          setSelectedChoice(choice => {
            choice--;
            if (choice < 0) {
              choice = script[currentIndex].choices.length - 1;
            }
            return choice;
          });
        } else if (isArrowDown(event)) {
          setSelectedChoice(choice => {
            choice++;
            if (choice >= script[currentIndex].choices.length) {
              choice = 0;
            }
            return choice;
          });
        }
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [currentIndex, selectedChoice, over]);

  if (over) {
    return null;
  }

  return (
    <div className={cn("Dialog", {
      "Dialog--top": top,
      "Dialog--continuable": currentIndex < script.length - 1
    })}>
      <DialogItem content={script[currentIndex]} selectedChoice={selectedChoice} />
    </div>
  );
}

Dialog.propTypes = {
  top: PropTypes.bool,
  script: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))]).isRequired
};

export default Dialog;
