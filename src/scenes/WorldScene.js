import Phaser from "phaser";

const VELOCITY = 80;

const ENCOUNTERS = [ // x, y, width, height
  [20, 50, 20, 20],
  [420, 350, 30, 30]
  // and so forth...
];

export default new Phaser.Class({
  Extends: Phaser.Scene,

  initialize() {
    Phaser.Scene.call(this, { key: "WorldScene" });
  },

  createPlayerAnimation(key, frames) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers("player", { frames }),
      frameRate: 10,
      repeat: -1
    });
  },

  onEncounter() {
    console.log("FOIGHT!");
  },

  create() {
    // Map
    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("spritesheet", "tiles"); // "tiles": resource name

    // "grass" and "obstacles" are layer names in map.json
    const grass = map.createStaticLayer("grass", tiles, 0, 0);
    const obstacles = map.createStaticLayer("obstacles", tiles, 0, 0);

    // Player
    this.player = this.physics.add.sprite(50, 100, "player", 6); // "player": resource name

    // Collision
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    obstacles.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, obstacles);

    // Movement (keyboard)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // hmmmmm

    // Player animation
    this.createPlayerAnimation("lateral", [1, 7, 1, 13]);
    this.createPlayerAnimation("up", [2, 8, 2, 14]);
    this.createPlayerAnimation("down", [0, 6, 0, 12]);

    // Encounter zones
    this.encounters = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
    ENCOUNTERS.forEach(encounter => this.encounters.create(...encounter));
    this.physics.add.overlap(this.player, this.encounters, this.onEncounter, false, this);
  },

  update(/*time, delta*/) {
    // Player movement
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-VELOCITY);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(VELOCITY);
    }

    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-VELOCITY);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(VELOCITY);
    }

    // Player animation
    if (this.cursors.left.isDown) {
      this.player.anims.play("lateral", true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("lateral", true);
      this.player.flipX = false;
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("up", true);
      this.player.flipX = false;
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("down", true);
      this.player.flipX = false;
    } else {
      this.player.anims.stop();
    }
  }
});
