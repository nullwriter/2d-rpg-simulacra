import Phaser from "phaser";

export default class AgentNPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frames, startFrameKey, key) {
        super(scene, x, y, texture, frames[startFrameKey]);
        this.frames = frames;
        this.scene = scene;
        this.npcKey = key;

        // Add self to scene's physics
        this.scene.physics.world.enable(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        this.setTexture(texture);

        this.maxHP = 100;
        this.hp = this.maxHP;

    }
}