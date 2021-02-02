import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import WorldScene from "./scenes/WorldScene";

import React from "react";
import ReactDOM from "react-dom";
import UI from "./ui/UI";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 320,
  height: 240,
  zoom: 2,
  pixelArt: true,

  physics: {
    default: "arcade",

    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },

  scene: [
    BootScene,
    WorldScene
  ]
});

export function renderUI(script) {
  const key = Math.random(); // force rerender when the method is called again

  ReactDOM.render(
    <UI key={key} script={Array.isArray(script) ? script : [script]} />,
    document.getElementById("ui")
  );
}
