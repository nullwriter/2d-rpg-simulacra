import AgentNPC from "./base/AgentNPC";

export default class Villager extends AgentNPC {

    walkAnims = {
        npc_up: [5, 11, 5, 17],
        npc_down: [3, 9, 3, 15],
        npc_side: [4, 10, 4, 16],
        npc_idle: [3, 9, 3, 15]
    };

    constructor(scene, x, y, texture, frames, startFrameKey) {
        super(scene, x, y, texture, frames, startFrameKey);
        this.setFrame(startFrameKey);
    }

    init(key) {

        this.setKey(key);

        // create animations
        for(const [key, val] of Object.entries(this.walkAnims)) {
            this.createAnimations(key, val, this.spriteTexture);
        }

        // create text object
        this.hoverText = this.scene.add.text(
            this.x, 
            this.y, 
            this.npcKey, 
            {
                fontFamily: 'Arial',
                fontSize: '8px',
                color: '#000000',
                padding: { x: 5, y: 3 },
            }
        );
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

    updateHoverTextPosition() {
        this.hoverText.setPosition(
            this.x - this.hoverText.width / 2,
            this.y - this.height - this.hoverText.height / 2
        );
    }

    update(time) {
       this.updateHoverTextPosition();
    }

}