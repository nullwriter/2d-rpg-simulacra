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

    update(time, delta, pointer) {
       this.updateHoverTextPosition();

       // if the pointer is down, move to the pointer using easystar
        if (pointer.isDown) {
            const cameraPointerX = pointer.x + this.scene.cameras.main.scrollX;
            const cameraPointerY = pointer.y + this.scene.cameras.main.scrollY;
            const targetTileX = Math.floor(cameraPointerX / this.scene.map.tileWidth);
            const targetTileY = Math.floor(cameraPointerY / this.scene.map.tileHeight);
        
            console.log(`targetTileX: ${targetTileX}, targetTileY: ${targetTileY}`);

            const npcTileX = Math.floor(this.x / this.scene.map.tileWidth);
            const npcTileY = Math.floor(this.y / this.scene.map.tileHeight);

            console.log(`npcTileX: ${npcTileX}, npcTileY: ${npcTileY}`);

            this.scene.easystar.findPath(npcTileX, npcTileY, targetTileX, targetTileY, newPath => {
                if (newPath !== null) {
                    this.moveNPC(newPath);
                } else {
                    console.warn("Path was not found.");
                }
            });

            this.scene.easystar.calculate();
        }
    }

    moveNPC(path) {
        var tweens = [];
        for(var i = 0; i < path.length-1; i++){
            var ex = path[i+1].x;
            var ey = path[i+1].y;
            tweens.push({
                targets: this,
                x: {value: ex * this.scene.map.tileWidth, duration: 200},
                y: {value: ey * this.scene.map.tileHeight, duration: 200}
            });
        }

        this.scene.tweens.timeline({
            tweens: tweens
        });
    }

}