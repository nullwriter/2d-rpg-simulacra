import Phaser from "phaser";
import { renderUI } from "../main";
import EncounterZone from "../objects/EncounterZone";
import EventZone from "../objects/EventZone";
import FramedSprite from "../objects/FramedSprite";
import AgentNPC from "../npc/base/AgentNPC";
import Villager from "../npc/Villager";

const VELOCITY = 80;
const ITEM_PADDING = 10;
const speedDiag = VELOCITY * (1/1.64);

const EVENTS = [
  {
    x: 50,
    y: 190,
    width: 50,
    height: 50,

    onEnter() {
      console.log("enter!");
    }
  }
];

const ITEMS = [
  {
    x: 200,
    y: 50,
    texture: "player",
    frames: { up: 5, down: 3, side: 4 },
    startFrameKey: "side",
    startFlipX: true,

    onInteract() {
      renderUI([
        "Bonjour, petit !",
        {
          text: "Bien dormi ?",
          choices: [
            {
              text: "Oui",
              // This could also update game variables to disable/change interactions later on
              action: () => renderUI("Ben tant mieux pour toi !")
            },
            {
              text: "Non",
              action: () => renderUI("Bah moi non plus lol")
            }
          ]
        }
      ]);
    }
  }
];

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
        frames: { up: 2, down: 0, side: 1 },
        startFrameKey: "side"
      }
    ]
  }
];

const AGENTS = [
  {
    x: 200,
    y: 50,
    texture: "agent-1",
    frames: { up: 6, down: 4, side: 5 },
    startFrameKey: "up",
    startFlipX: true,
    key: "villager_1",
  },
  {
    x: 100,
    y: 50,
    texture: "agent-1",
    frames: { up: 24, down: 22, side: 23 },
    startFrameKey: "side",
    startFlipX: true,
    key: "villager_2",
  }
];

function triggerZone(player, zone) {
  zone.trigger();
}

function makeImmovable(sprite) {
  sprite.body.immovable = true;
}

export default new Phaser.Class({
  Extends: Phaser.Scene,

  initialize() {
    Phaser.Scene.call(this, { key: "WorldScene" });
    this.time 
  },

  createPlayerAnimation(key, frames, sprite) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(sprite, { frames }),
      frameRate: 10,
      repeat: -1
    });
  },

  rotateTowardsPlayer(sprite) {
    const xDiff = this.player.x - sprite.x;
    const yDiff = this.player.y - sprite.y;
    sprite.flipX = false;

    // "Greater difference" determines which axis to take into account
    // Favour horizontal axis in case of strict equality, like for movement
    if (Math.abs(yDiff) > Math.abs(xDiff)) {
      if (yDiff > 0) {
        sprite.setFrame(sprite.frames.down);
      } else {
        sprite.setFrame(sprite.frames.up);
      }
    } else {
      sprite.setFrame(sprite.frames.side);

      if (xDiff < 0) {
        sprite.flipX = true; // left
      }
    }
  },

  createEvents(events) {
    this.eventZones = this.physics.add.group({ classType: EventZone });

    this.eventZones.addMultiple(
      events.map(({ x, y, width, height, onEnter, onExit }) => new EventZone(this, x, y, width, height, onEnter, onExit)),
      true
    );

    this.physics.add.overlap(this.player, this.eventZones, triggerZone, false, this);
  },

  // createAgentNPCs function that creates NPCs from a list received from parameter
  createAgentNPCs(npcs, obstacles, obstaclesTrees) {
    this.spawns = this.physics.add.group({
      classType: Villager
    });

    for (var i = 1; i < 5; i++) {
      const x = 100 * 1;
      let y = 20 * i;
      // parameters are x, y, width, height
      var enemy = this.spawns.create(x, y, 'agent-1', [3, 9, 3, 15], 3, 'npc_agent_1');
      enemy.body.setCollideWorldBounds(true);
      enemy.body.setImmovable();
      
      this.physics.add.collider(enemy, obstacles);
      this.physics.add.collider(enemy, obstaclesTrees);
    }

    this.physics.add.collider(this.player, this.spawns);
    this.physics.add.collider(this.spawns, this.spawns);

    // move enemies
    this.timedEvent = this.time.addEvent({
      delay: 3000,
      callback: this.moveEnemies,
      callbackScope: this,
      loop: true
    });
  },

  createItems(items) {
    this.itemZones = this.physics.add.group({ classType: EventZone });
    this.itemSprites = this.physics.add.group({ classType: FramedSprite });

    items.forEach(({ x, y, texture, frames, startFrameKey, startFlipX, onInteract }) => {
      const sprite = new FramedSprite(this, x, y, texture, frames, startFrameKey);
      sprite.flipX = !!startFlipX;

      const zone = new EventZone(
        this,
        x,
        y,
        sprite.width + ITEM_PADDING,
        sprite.height + ITEM_PADDING,
        () => {
          this.actionKey.on("down", () => {
            this.rotateTowardsPlayer(sprite);
            onInteract();
          });
        },
        () => {
          this.actionKey.off("down");
        }
      );

      this.itemZones.add(zone, true);
      this.itemSprites.add(sprite, true);
    });

    this.itemSprites.children.entries.forEach(makeImmovable);
    this.physics.add.overlap(this.player, this.itemZones, triggerZone, false, this);
    this.physics.add.collider(this.player, this.itemSprites);
  },

  createEncounters(encounters) {
    this.encounterZones = this.physics.add.group({ classType: EncounterZone });
    this.encounterSprites = this.physics.add.group({ classType: FramedSprite });

    encounters.forEach(encounter => {
      const sprites = encounter.sprites.map(({ x, y, texture, frames, startFrameKey, startFlipX }) => {
        const sprite = new FramedSprite(
          this,
          encounter.x + x,
          encounter.y + y,
          texture,
          frames,
          startFrameKey
        );

        sprite.flipX = !!startFlipX;
        return sprite;
      });

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

    this.encounterSprites.children.entries.forEach(makeImmovable);
    this.physics.add.overlap(this.player, this.encounterZones, this.onEncounter, false, this);
    this.physics.add.collider(this.player, this.encounterSprites);
  },

  onEncounter(player, zone) {
    zone.trigger();

    // TODO: battle
    // To run code only once, use callback(s) in super() in EncounterZone
    zone.sprites.forEach(sprite => {
      this.rotateTowardsPlayer(sprite);
    });
  },

  moveEnemies () {
    this.spawns.getChildren().forEach((enemy) => {
      const randNumber = Math.floor((Math.random() * 4) + 1);
      const randSpeed = Math.floor((Math.random() * 100) + 10);

      switch(randNumber) {
        case 1:
          enemy.body.setVelocityX(randSpeed);
          enemy.anims.play("npc_side", true);
          enemy.flipX = false;
          break;
        case 2:
          enemy.body.setVelocityX(-1 * randSpeed);
          enemy.anims.play("npc_side", true);
          enemy.flipX = true;
          break;
        case 3:
          enemy.body.setVelocityY(randSpeed);
          enemy.anims.play("npc_down", true);
          enemy.flipX = false;
          break;
        case 4:
          enemy.anims.play("npc_up", true);
          enemy.flipX = false;
          enemy.body.setVelocityY(-1 * randSpeed);
          break;
        default:
          enemy.body.setVelocityX(randSpeed);
          enemy.anims.play("npc_side", true);
          enemy.flipX = false;
      }
    });
    setTimeout(() => {
      this.spawns.setVelocityX(0);
      this.spawns.setVelocityY(0);
      this.spawns.getChildren().forEach((enemy) => {
        enemy.anims.stop();
      });
    }, 500);
  },

  create() {
    // Map
    const map = this.make.tilemap({ key: "SereneVillage2" });
    const tiles = map.addTilesetImage("SereneVillage2", "tiles"); // "tiles": resource name

    // "grass" and "obstacles" are layer names in map.json
    const grass = map.createStaticLayer("Grass", tiles);
    const obstacles = map.createStaticLayer("Water", tiles);
    const obstaclesTrees = map.createStaticLayer("Trees", tiles);

    // Player
    this.player = this.physics.add.sprite(100, 100, "player", 6); // "player": resource name

    // Collision
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    obstacles.setCollisionByExclusion([-1]);
    obstaclesTrees.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, obstacles);
    this.physics.add.collider(this.player, obstaclesTrees);

    // Keyboard
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.actionKey = this.input.keyboard.addKey("space");

    // Camera
    this.cameras.main.setBounds(0, 0, grass.width * grass.scaleX, grass.height * grass.scaleY);
    this.cameras.main.roundPixels = true; // hmmmmm
    this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.cameraDolly);

    // Player animation
    this.createPlayerAnimation("side", [1, 7, 1, 13], 'player');
    this.createPlayerAnimation("up", [2, 8, 2, 14], 'player');
    this.createPlayerAnimation("down", [0, 6, 0, 12], 'player');

    // World elements
    // this.createEvents(EVENTS);
    // this.createItems(ITEMS);
    // this.createEncounters(ENCOUNTERS);
    this.createAgentNPCs(AGENTS, obstacles, obstaclesTrees);
  },

  update(/*time, delta*/) {
    // Player movement
    this.player.body.setVelocity(0);

    if (this.cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-VELOCITY);
    } else if (this.cursorKeys.right.isDown) {
      this.player.body.setVelocityX(VELOCITY);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.body.setVelocityY(-VELOCITY);
    } else if (this.cursorKeys.down.isDown) {
      this.player.body.setVelocityY(VELOCITY);
    }

    // Player animation
    if (this.cursorKeys.left.isDown) {
      this.player.anims.play("side", true);
      this.player.flipX = true;
    } else if (this.cursorKeys.right.isDown) {
      this.player.anims.play("side", true);
      this.player.flipX = false;
    } else if (this.cursorKeys.up.isDown) {
      this.player.anims.play("up", true);
      this.player.flipX = false;
    } else if (this.cursorKeys.down.isDown) {
      this.player.anims.play("down", true);
      this.player.flipX = false;
    } else if (this.cursorKeys.left.isDown && this.cursorKeys.up.isDown) {
      this.player.body.setVelocityX(-speedDiag);
      this.player.body.setVelocityY(-speedDiag);
    } else if (this.cursorKeys.right.isDown && this.cursorKeys.up.isDown) {
      this.player.body.setVelocityX(speedDiag);
      this.player.body.setVelocityY(-speedDiag);
    } else if (this.cursorKeys.left.isDown && this.cursorKeys.down.isDown) {
      this.player.body.setVelocityX(-speedDiag);
      this.player.body.setVelocityY(speedDiag);
    } else if (this.cursorKeys.right.isDown && this.cursorKeys.down.isDown) {
      this.player.body.setVelocityX(speedDiag);
      this.player.body.setVelocityY(speedDiag);
    } else {
      this.player.anims.stop();
    }

    // Reset event zone overlaps
    // this.eventZones.children.entries.forEach(zone => zone.reset());
    // this.itemZones.children.entries.forEach(zone => zone.reset());
    // this.encounterZones.children.entries.forEach(zone => zone.reset());
    this.cameraDolly.x = Math.floor(this.player.x);
    this.cameraDolly.y = Math.floor(this.player.y);
  }
});
