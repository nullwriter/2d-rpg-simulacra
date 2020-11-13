import Phaser from "phaser";

export default class FramedSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frames, startFrameKey) {
    super(scene, x, y, texture, frames[startFrameKey]);
    this.frames = frames;
  }
}
