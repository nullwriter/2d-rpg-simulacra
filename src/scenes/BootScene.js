import Phaser from "phaser";
import tiles from "../../assets/map/spritesheet.png";
import map from "../../assets/map/map.json";
import player from "../../assets/RPG_assets.png";

export default new Phaser.Class({
  Extends: Phaser.Scene,

  initialize() {
    Phaser.Scene.call(this, { key: "BootScene" });
  },

  preload() {
    this.load.image("tiles", tiles);
    this.load.tilemapTiledJSON("map", map);
    this.load.spritesheet("player", player, { frameWidth: 16, frameHeight: 16 });
  },

  create() {
    this.scene.start("WorldScene");
  }
});
