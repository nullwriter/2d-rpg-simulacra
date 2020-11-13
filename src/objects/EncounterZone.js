import EventZone from "./EventZone";

export default class EncounterZone extends EventZone {
  constructor(scene, x, y, width, height, sprites) {
    super(scene, x, y, width, height);
    this.sprites = sprites;
  }
}
