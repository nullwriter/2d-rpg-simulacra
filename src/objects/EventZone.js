import Phaser from "phaser";

export default class EventZone extends Phaser.GameObjects.Zone {
  constructor(scene, x, y, width, height, onEnter, onExit) {
    super(scene, x, y, width, height);

    let triggered = false;
    let reset = true;

    this.trigger = () => {
      if (!triggered) {
        if (typeof onEnter === "function") {
          onEnter();
        }

        triggered = true;
        reset = false;
      }
    };

    this.reset = () => {
      if (!this.body.embedded && !reset) {
        if (typeof onExit === "function") {
          onExit();
        }

        triggered = false;
        reset = true;
      }
    }
  }
}
