import Phaser from "phaser";

export default class EncounterZone extends Phaser.GameObjects.Zone {
  constructor(scene, x, y, width, height, sprites) {
    super(scene, x, y, width, height);
    this.sprites = sprites;
  }
}
