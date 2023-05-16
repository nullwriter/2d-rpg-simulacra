import Phaser from "phaser";
import playerOne from "../../assets/characters/player_1/player_1.png";
import playerOneJson from "../../assets/characters/player_1/player_1_atlas.json";
import playerOneAnim from "../../assets/characters/player_1/player_1_anim.json";

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
        this.lastAnim = "idle_side";

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(
            this.x, 
            this.y, 
            12, 
            { 
                isSensor: false, 
                label: "playerCollider" 
            }
        );
        var playerSensor = Bodies.circle(
            this.x,
            this.y,
            48,
            {
                isSensor: true,
                label: "playerSensor"
            }
        );
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
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
            this.lastAnim = "walk_side";
            this.anims.play("walk_side", true);
            this.flipX = false;
        } else if (this.cursorKeys.right.isDown) {
            this.lastAnim = "walk_side";
            this.anims.play("walk_side", true);
            this.flipX = true;
        } else if (this.cursorKeys.up.isDown) {
            this.lastAnim = "walk_up";
            this.anims.play("walk_up", true);
            this.flipX = false;
        } else if (this.cursorKeys.down.isDown) {
            this.lastAnim = "walk_down";
            this.anims.play("walk_down", true);
            this.flipX = false;
        } else {
            this.anims.play(this.lastAnim.replace("walk", "idle"), true);
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }
}