import Phaser from "phaser";
import tiles from "../../assets/map/level/WorldMapBase.png";
import map from "../../assets/map/level/WorldMapBase.json";
import player from "../../assets/characters/Male/Male 01-1.png";
import agentNpc from "../../assets/characters/Male/Male 01-2.png";

export default new Phaser.Class({
  Extends: Phaser.Scene,

  initialize() {
    Phaser.Scene.call(this, { key: "BootScene" });
  },

  preload() {
    this.load.image("tiles", tiles);
    this.load.tilemapTiledJSON("SereneVillage2", map);
    this.load.spritesheet("player", player, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("agent-1", agentNpc, { frameWidth: 32, frameHeight: 32 });
  },

  create() {
    this.scene.start("WorldScene");
  }
});
