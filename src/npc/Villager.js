import AgentNPC from "./base/AgentNPC";

export default class Villager extends AgentNPC {
    constructor(scene, x, y, texture, frames, startFrameKey, key) {
        super(scene, x, y, texture, frames[startFrameKey], key);
        this.frames = frames;
    }

    // Phaser update function for this NPC, should update animations, flags for where it's going, etc.
    update() {
       console.log('update villager = ' + this.key);
    }

}