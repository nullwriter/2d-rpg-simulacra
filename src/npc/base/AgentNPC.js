import Phaser from "phaser";

export default class AgentNPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frames, startFrameKey) {
        super(scene, x, y, texture, frames[startFrameKey]);
        this.frames = frames;
        this.scene = scene;
        this.spriteTexture = texture;

        // Add self to scene's physics
        this.scene.physics.world.enable(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        this.maxHP = 100;
        this.hp = this.maxHP;
    }

    setKey(key) {
        this.npcKey = key;
    }
}