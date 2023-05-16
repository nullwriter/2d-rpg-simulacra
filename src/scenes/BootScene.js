import Phaser from "phaser";
import tiles from "../../assets/map/level/WorldMapBase.png";
import map from "../../assets/map/level/WorldMapBase.json";
import Player from "../player/Player";
import Villager from "../npc/Villager";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("tiles", tiles);
    this.load.tilemapTiledJSON("SereneVillage2", map);

    Player.preload(this);
    Villager.preload(this);
  }

  create() {
    this.scene.start("WorldScene");
  }
}
