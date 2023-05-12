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

        // create animations
        for(const [key, val] of Object.entries(this.walkAnims)) {
            this.createAnimations(key, val, texture);
        }

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

    moveSide(velocity) {
        this.body.setVelocityX(velocity);
        this.anims.play('npc_side', true);
        this.flipX = velocity < 0;
    }

    moveUp(velocity) {
        this.body.setVelocityY(velocity);
        this.anims.play('npc_up', true);
    }

    moveDown(velocity) {
        this.body.setVelocityY(velocity);
        this.anims.play('npc_down', true);
    }

    randomWander() {
        const randNumber = Math.floor((Math.random() * 4) + 1);
        const randSpeed = Math.floor((Math.random() * 100) + 10);
  
        switch(randNumber) {
          case 1:
            this.moveSide(randSpeed);
            break;
          case 2:
            this.moveSide(-1 * randSpeed);
            break;
          case 3:
            this.moveDown(randSpeed)
            break;
          case 4:
            this.moveUp(-1 * randSpeed);
            break;
          default:
            this.moveSide(randSpeed);
        }
    }

    // Phaser update function for this NPC, should update animations, flags for where it's going, etc.
    update() {
       console.log('update villager = ' + this.key);
    }

}