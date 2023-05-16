import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import BootScene from "./scenes/BootScene";
import WorldScene from "./scenes/WorldScene";

import React from "react";
import ReactDOM from "react-dom";
import UI from "./ui/UI";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 520,
  height: 340,
  zoom: 2,

  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0 },
      debug: false
    }
  },

  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin.default,
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
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
