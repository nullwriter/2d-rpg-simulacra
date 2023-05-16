import Phaser from "phaser";
import playerOne from "../../assets/characters/player_1/player_1.png";
import playerOneJson from "../../assets/characters/player_1/player_1_atlas.json";
import playerOneAnim from "../../assets/characters/player_1/player_1_anim.json";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
    }

    static preload(scene) {
        scene.load.atlas("player_1", playerOne, playerOneJson);
        scene.load.animation("player_1_anim", playerOneAnim);
    }

    update(time, delta) {
        // Player movement
        const speed = 1.5;
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
            this.anims.play("walk_side", true);
            this.flipX = false;
        } else if (this.cursorKeys.right.isDown) {
            this.anims.play("walk_side", true);
            this.flipX = true;
        } else if (this.cursorKeys.up.isDown) {
            this.anims.play("walk_up", true);
            this.flipX = false;
        } else if (this.cursorKeys.down.isDown) {
            this.anims.play("walk_down", true);
            this.flipX = false;
        } else {
            this.anims.play('idle_side', true);
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }
}