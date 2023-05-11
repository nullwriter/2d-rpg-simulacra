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

        this.setTexture(texture);

        this.maxHP = 100;
        this.hp = this.maxHP;

        // Player animation
        this.createPlayerAnimation("side", [1, 7, 1, 13]);
        this.createPlayerAnimation("up", [2, 8, 2, 14]);
        this.createPlayerAnimation("down", [0, 6, 0, 12]);

        const timedEvent1 = new Phaser.Time.TimerEvent({
            delay: 2000,
            callback: this.onWalkEvent,
            callbackScope: this,
            loop: true
        });
    }

    onWalkEvent() {
        console.log('onWalkEvent');
        this.setVelocityX(100);
        this.anims.play("side", true);
    }

    createPlayerAnimation(key, frames) {
        this.scene.anims.create({
          key,
          frames: this.scene.anims.generateFrameNumbers(this.npcKey+"_player", { frames }),
          frameRate: 10,
          repeat: -1
        });
    }

  // damageOrKill function that returns boolean
    damageOrKill(damage) {
        this.hp -= damage;

        if (this.hp <= 0) {
            this.die();
            return true;
        }

        return false;
    }

    die() {
        this.destroy();
    }

    destroy() {
        this.setActive(false);
    }

    isDead() {
        return !this.active;
    }
}