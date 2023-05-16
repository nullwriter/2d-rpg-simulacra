import Phaser from "phaser";

export default class AgentNPC extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frames, startFrameKey) {
        super(scene.matter.world, x, y, texture, frames[startFrameKey]);
        this.scene = scene;
        this.spriteTexture = texture;
        this.maxHP = 100;
        this.hp = this.maxHP;
        this.speed = 80;
    }

    init(key, debugPath = false){
        this.debugPath = debugPath;
        this.npcKey = key;

        if(this.debugPath){
            this.pathGraphics = new Phaser.GameObjects.Graphics(this.scene);
            this.scene.add.existing(this.pathGraphics);
        }
    }

    update(time, delta, pointer) {
        // if the pointer is down, move to the pointer using easystar
        if (pointer.isDown) {
            const cameraPointerX = pointer.x + this.scene.cameras.main.scrollX;
            const cameraPointerY = pointer.y + this.scene.cameras.main.scrollY;
            const targetTileX = Math.floor(cameraPointerX / this.scene.map.tileWidth);
            const targetTileY = Math.floor(cameraPointerY / this.scene.map.tileHeight);
        
            // console.log(`targetTileX: ${targetTileX}, targetTileY: ${targetTileY}`);

            const npcTileX = Math.floor(this.x / this.scene.map.tileWidth);
            const npcTileY = Math.floor(this.y / this.scene.map.tileHeight);

            // console.log(`npcTileX: ${npcTileX}, npcTileY: ${npcTileY}`);

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

    showPath(path) {
        this.pathGraphics.clear();

        this.pathGraphics.fillStyle(0x00ff00, 0.5); // Green color with 50% opacity
        this.pathGraphics.lineStyle(2, 0x00ff00, 1); // Green border

         // Add new path markers
        for (let i = 0; i < path.length; i++) {
            let x = path[i].x * this.scene.map.tileWidth + this.scene.map.tileWidth / 2;
            let y = path[i].y * this.scene.map.tileHeight + this.scene.map.tileHeight / 2;
            this.pathGraphics.fillCircle(x, y, this.scene.map.tileWidth / 8);
        }
    }

    moveNPC(path) {
        if(this.debugPath){
            this.showPath(path);
        }

        var tweens = [];
        for(var i = 0; i < path.length-1; i++){
            var ex = path[i+1].x;
            var ey = path[i+1].y;
            let direction = this.getDirection(path[i], path[i+1]);

            // Calculate the distance between two points
            let distance = this.scene.map.tileWidth; // Assuming constant distance between tiles

            // Calculate the duration based on the distance and speed
            let duration = (distance / this.speed) * 1000; // Convert from seconds to milliseconds

            tweens.push({
                targets: this,
                x: {value: ex * this.scene.map.tileWidth, duration},
                y: {value: ey * this.scene.map.tileHeight, duration},
                onStart: () => {
                    this.play(direction);
                },
                onComplete: (i === path.length - 2) ? () => {
                    this.anims.stop();
                } : null
            });
        }

        this.scene.tweens.timeline({
            tweens: tweens
        });
    }

    getDirection(start, end){
        if(start.x < end.x){
            return "npc_right";
        } else if(start.x > end.x){
            return "npc_left";
        } else if(start.y < end.y){
            return "npc_down";
        } else if(start.y > end.y){
            return "npc_up";
        } else {
            return "npc_idle";
        }
    }
}