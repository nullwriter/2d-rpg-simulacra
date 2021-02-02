import React, { useState } from "react";
import Dialog from "./Dialog";

export default function UI({ script }) {
  return (
    <Dialog script={script} />
  );
}

export const isConfirm = event => [13, 32].includes(event.keyCode); // Enter, Space
export const isArrowUp = event => event.keyCode === 38;
export const isArrowRight = event => event.keyCode === 39;
export const isArrowDown = event => event.keyCode === 40;
export const isArrowLeft = event => event.keyCode === 37;
