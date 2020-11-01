import Phaser from "phaser";
import EncounterZone from "../EncounterZone";

const VELOCITY = 80;

const ENCOUNTERS = [
  {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    sprites: [
      {
        x: 0,
        y: 0,
        texture: "player",
        frame: 2
      }
    ]
  }
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

  onEncounter(player, zone) {
    zone.sprites.forEach(sprite => {
      const xDiff = player.x - sprite.x;
      const yDiff = player.y - sprite.y;

      // "Greater difference" determines which axis to take into account
      // Favour horizontal axis in case of strict equality, like for movement
      if (Math.abs(yDiff) > Math.abs(xDiff)) {
        sprite.flipX = false;

        if (yDiff > 0) {
          sprite.setFrame(0); // down
        } else {
          sprite.setFrame(2); // up
        }
      } else {
        sprite.setFrame(1); // lateral

        if (xDiff < 0) {
          sprite.flipX = true; // left
        }
      }
    });
  },

  create() {
    // Map
    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("spritesheet", "tiles"); // "tiles": resource name

    // "grass" and "obstacles" are layer names in map.json
    const grass = map.createStaticLayer("grass", tiles, 0, 0);
    const obstacles = map.createStaticLayer("obstacles", tiles, 0, 0);

    // Player
    this.player = this.physics.add.sprite(100, 100, "player", 6); // "player": resource name

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

    // Encounters
    this.encounterZones = this.physics.add.group({ classType: EncounterZone });
    this.encounterSprites = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });

    ENCOUNTERS.forEach((encounter, index) => {
      const sprites = encounter.sprites.map(sprite => new Phaser.GameObjects.Sprite(
        this,
        encounter.x + sprite.x,
        encounter.y + sprite.y,
        sprite.texture,
        sprite.frame
      ));

      const zone = new EncounterZone(
        this,
        encounter.x,
        encounter.y,
        encounter.width,
        encounter.height,
        sprites
      );

      this.encounterZones.add(zone, true);
      this.encounterSprites.addMultiple(sprites, true);
    });

    this.encounterSprites.children.entries.forEach(sprite => {
      sprite.body.immovable = true;
    });

    this.physics.add.overlap(this.player, this.encounterZones, this.onEncounter, false, this);
    this.physics.add.collider(this.player, this.encounterSprites);
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
