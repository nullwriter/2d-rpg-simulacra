import AgentNPC from "./base/AgentNPC";
import playerTwo from "../../assets/characters/player_2/player_2.png";
import playerTwoJson from "../../assets/characters/player_2/player_2_atlas.json";
import playerTwoAnim from "../../assets/characters/player_2/player_2_anim.json";

export default class Villager extends AgentNPC {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

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
        scene.load.atlas("player_2", playerTwo, playerTwoJson);
        scene.load.animation("player_2_anim", playerTwoAnim);
    }

    init(key, debugPath = false) {
        super.init(key, debugPath);

        // create text object
        this.hoverText = this.scene.add.text(
            this.x, 
            this.y, 
            this.npcKey, 
            {
                fontFamily: 'Arial',
                fontSize: '8px',
                color: '#000000',
                padding: { x: 5, y: 3 },
            }
        );
    }

    moveSide(velocity) {
        this.body.setVelocityX(velocity);
        this.anims.play('npc_side', true);
        this.flipX = velocity < 0;
    }

    moveUp(velocity) {
        this.body.setVelocityY(velocity);
        this.anims.play('npc_up', true);
    }

    moveDown(velocity) {
        this.body.setVelocityY(velocity);
        this.anims.play('npc_down', true);
    }

    randomWander() {
        const randNumber = Math.floor((Math.random() * 4) + 1);
        const randSpeed = Math.floor((Math.random() * 100) + 10);
  
        switch(randNumber) {
          case 1:
            this.moveSide(randSpeed);
            break;
          case 2:
            this.moveSide(-1 * randSpeed);
            break;
          case 3:
            this.moveDown(randSpeed)
            break;
          case 4:
            this.moveUp(-1 * randSpeed);
            break;
          default:
            this.moveSide(randSpeed);
        }
    }

    updateHoverTextPosition() {
        this.hoverText.setPosition(
            this.x - this.hoverText.width / 2,
            this.y - this.height - this.hoverText.height / 2
        );
    }

    update(time, delta, pointer) {
        super.update(time, delta, pointer);
        this.updateHoverTextPosition();
    }

}