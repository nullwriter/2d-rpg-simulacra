import Phaser from "phaser";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        // Player movement
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();

        if (this.cursorKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.cursorKeys.right.isDown) {
            playerVelocity.x = 1;
        }

        if (this.cursorKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.cursorKeys.down.isDown) {
            playerVelocity.y = 1;
        }

        // Player animation
        if (this.cursorKeys.left.isDown) {
            this.anims.play("side", true);
            this.flipX = true;
        } else if (this.cursorKeys.right.isDown) {
            this.anims.play("side", true);
            this.flipX = false;
        } else if (this.cursorKeys.up.isDown) {
            this.anims.play("up", true);
            this.flipX = false;
        } else if (this.cursorKeys.down.isDown) {
            this.anims.play("down", true);
            this.flipX = false;
        } else {
            this.anims.stop();
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }
}