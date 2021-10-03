import  * as Math3d from './math3d.js'
import { Vector3 } from './math3d.js';
import Vector4 from './math3d.js';
import Entity from './entity.js';
import Keyboard from "./keyboard.js";

export class Camera extends Entity
{
    //new Vector3(-17, 8, 12)
    //new Vector3(0.811, -0.14, -0.568)
    constructor(pos = new Vector3(0, 0, 0), pitch = 0, yaw = -90)
    {
        super(false, pos);
        this.fov = 90;
        this.far = 1000;
        this.near = 1;
        //this.target = target; // this.pos + this.front
        this.up = new Vector3(0, 1, 0);
        this.front = new Vector3(0, 0, 1);
        this.viewMatrix = null;
        this.speed = 0;

        // the front vector DOESN'T Matter we catculated by the pitsh & yaw
        this.pitch = pitch; // 0
        this.yaw = yaw; // -90
    }

    // v means point in space
    getDirection(v)
    {
        return Math3d.normalize(v.sub(this.pos));
    }

    getViewMatrix()
    {
        return this.viewMatrix;
    }

    updateViewMatrix()
    {
        if (this.pitch > 89)
            this.pitch = 89;
        if (this.pitch < -89)
            this.pitch = -89;



        this.front.x = Math.cos(Math3d.radians(this.yaw)) * Math.cos(Math3d.radians(this.pitch));
        this.front.y = Math.sin(Math3d.radians(this.pitch));
        this.front.z = Math.sin(Math3d.radians(this.yaw)) * Math.cos(Math3d.radians(this.pitch));
        this.front = Math3d.normalize(this.front);

        this.viewMatrix = Math3d.createLookAt(this.pos, this.pos.add(this.front), this.up);
    }

    update(game)
    {
        this.speed = 3 * game.timestamp;

        // Show Camera info
        if (game.input.keypress(Keyboard.KEY_4))
        {
            this.info();
        }

        // move front
        if (game.input.keypress(Keyboard.KEY_Z))
        {
            //console.log('Go front');
            this.pos = this.pos.add(this.front.multi(this.speed));
        }
        // move back
        if (game.input.keypress(Keyboard.KEY_S))
        {
            //console.log('Go back');
            this.pos = this.pos.sub(this.front.multi(this.speed));
        }

        // move Right
        if (game.input.keypress(Keyboard.KEY_D))
        {
            //console.log('Go right');
            this.pos = this.pos.add(Math3d.normalize(this.front.cross(this.up)).multi(this.speed));
        }
        // move left
        if (game.input.keypress(Keyboard.KEY_Q))
        {
            //console.log('Go left');
            this.pos = this.pos.sub(Math3d.normalize(this.front.cross(this.up)).multi(this.speed));
        }

        // for Camera direction
        // look up
        if (game.input.keypress(Keyboard.KEY_ARROW_UP)) {
            //console.log('pitch Rotate Camera');
            this.pitch += this.speed * 5;
        }

        // look down
        if (game.input.keypress(Keyboard.KEY_ARROW_DOWN)) {
            //console.log('pitch Rotate Camera');
            this.pitch -= this.speed * 5;
        }

        // turn right
        if (game.input.keypress(Keyboard.KEY_ARROW_RIGHT)) {
            //console.log('yaw Rotate Camera');
            this.yaw += this.speed * 5;
        }

        // turn left
        if (game.input.keypress(Keyboard.KEY_ARROW_LEFT)) {
            //console.log('yaw Rotate Camera');
            this.yaw -= this.speed * 5;
        }

        this.updateViewMatrix();
    }

    info()
    {
        console.log('----------- Camera info -----------');
        console.log(`Position:`, this.pos);
        console.log(`Front:`, this.front);
        console.log(`Up:`, this.up)
        console.log('Pitch:', this.pitch);
        console.log('Yaw:', this.yaw);
        console.log('-----------------------------------');
    }
}
