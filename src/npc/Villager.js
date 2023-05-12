import AgentNPC from "./base/AgentNPC";

export default class Villager extends AgentNPC {

    walkAnims = {
        npc_up: [5, 11, 5, 17],
        npc_down: [3, 9, 3, 15],
        npc_side: [4, 10, 4, 16],
        npc_idle: [3, 9, 3, 15]
    };

    constructor(scene, x, y, texture, frames, startFrameKey, key) {
        super(scene, x, y, texture, frames, startFrameKey, key);
        this.frames = frames;

        // loop through walk anims and do createAnimations
        this.createAnimations("npc_up", this.walkAnims.npc_up, texture);
        this.createAnimations("npc_down", this.walkAnims.npc_down, texture);
        this.createAnimations("npc_side", this.walkAnims.npc_side, texture);
        this.createAnimations("npc_idle", this.walkAnims.npc_idle, texture);
        
        this.setFrame(3);
    }

    createAnimations(key, frames, sprite) {
        this.scene.anims.create({
            key,
            frames: this.scene.anims.generateFrameNumbers(sprite, { frames }),
            frameRate: 10,
            repeat: -1
          });
    }

    // Phaser update function for this NPC, should update animations, flags for where it's going, etc.
    update() {
       console.log('update villager = ' + this.key);
    }

}