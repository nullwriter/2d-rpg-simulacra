import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import WorldScene from "./scenes/WorldScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "container",
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
