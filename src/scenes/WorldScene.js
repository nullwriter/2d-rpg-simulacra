import Phaser from "phaser";
import { renderUI } from "../main";
import EncounterZone from "../objects/EncounterZone";
import EventZone from "../objects/EventZone";
import FramedSprite from "../objects/FramedSprite";
import Villager from "../npc/Villager";
import EasyStar from "easystarjs";
import Player from "../player/Player";

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

export default class WorldScene extends Phaser.Scene {
  
  constructor() {
    super({ key: "WorldScene" });
  }

  createPlayerAnimation(key, frames, sprite) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(sprite, { frames }),
      frameRate: 10,
      repeat: -1
    });
  }

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
  }

  createEvents(events) {
    this.eventZones = this.physics.add.group({ classType: EventZone });

    this.eventZones.addMultiple(
      events.map(({ x, y, width, height, onEnter, onExit }) => new EventZone(this, x, y, width, height, onEnter, onExit)),
      true
    );

    this.physics.add.overlap(this.player, this.eventZones, triggerZone, false, this);
  }

  // createAgentNPCs function that creates NPCs from a list received from parameter
  createAgentNPCs(npcs, obstacles, obstaclesTrees) {
    this.spawns = this.add.group({
      classType: Villager
    });

    for (var i = 1; i < 2; i++) {
      const x = 100 * 1;
      let y = 20 * i;
      // parameters are x, y, width, height
      var enemy = this.spawns.create(x, y, 'agent-1', [3, 9, 3, 15], 3);
      enemy.init('npc_agent_'+i, true);
      // enemy.body.setCollideWorldBounds(true);
      // enemy.body.setImmovable();

      // this.physics.add.collider(enemy, obstacles);
      // this.physics.add.collider(enemy, obstaclesTrees);

      this.matter.add.gameObject(enemy);
    }
  }

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
  }

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
  }

  onEncounter(player, zone) {
    zone.trigger();

    // TODO: battle
    // To run code only once, use callback(s) in super() in EncounterZone
    zone.sprites.forEach(sprite => {
      this.rotateTowardsPlayer(sprite);
    });
  }

  moveEnemies () {
    this.spawns.getChildren().forEach((enemy) => {
      // enemy.randomWander();
    });

    setTimeout(() => {
      this.spawns.setVelocityX(0);
      this.spawns.setVelocityY(0);
      this.spawns.getChildren().forEach((enemy) => {
        enemy.anims.stop();
      });
    }, 500);
  }

  create() {
    // Map
    this.map = this.make.tilemap({ key: "SereneVillage2" });
    const tiles = this.map.addTilesetImage("SereneVillage2", "tiles"); // "tiles": resource name

    // "grass" and "obstacles" are layer names in map.json
    const grass = this.map.createLayer("Grass", tiles);
    const obstacles = this.map.createLayer("Obstacles", tiles);

    this.collisionLayer = obstacles;

    // Player
    this.player = new Player(this, 100, 100, "player", 6);

    // Collision
    obstacles.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(obstacles);

    // Set up easystar js
    this.easystar = new EasyStar.js();
    
    // Set up easystar grid with obstacles
    const grid = [];
    for (let y = 0; y < this.map.height; y++) {
      const col = [];
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.map.getTileAt(x, y, true, "Obstacles");
        col.push(tile ? tile.index : 0);
      }
      grid.push(col);
    }

    this.easystar.setGrid(grid);
    this.easystar.setAcceptableTiles([-1]);

    // Camera
    this.cameras.main.setBounds(0, 0, grass.width * grass.scaleX, grass.height * grass.scaleY);
    this.cameras.main.roundPixels = true; // hmmmmm
    this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.cameraDolly);

    // Player animation
    this.createPlayerAnimation("side", [6, 7, 8], 'player');
    this.createPlayerAnimation("up", [9, 10, 11], 'player');
    this.createPlayerAnimation("down", [0, 1, 2], 'player');

    // World elements
    this.createAgentNPCs(AGENTS, obstacles);

    // Keyboard
    this.actionKey = this.input.keyboard.addKey("space");

    // Pointer: grab the pointer of game input
    this.pointer = this.input.activePointer;
  }

  update(time, delta) {
    // Camera
    this.cameraDolly.x = Math.floor(this.player.x);
    this.cameraDolly.y = Math.floor(this.player.y);

    this.player.update(time, delta, this.cursors, this.actionKey);
    
    // update all spawns
    this.spawns.getChildren().forEach((enemy) => {
      enemy.update(time, delta, this.pointer);
    });
  }
}
