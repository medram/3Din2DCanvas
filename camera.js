import  * as Math3d from './math3d.js'
import { Vector3 } from './math3d.js';
import Vector4 from './math3d.js';
import Entity from './entity.js';
import Keyboard from "./keyboard.js";

export class Camera extends Entity
{
    //new Vector3(-17, 8, 12)
    //new Vector3(0.811, -0.14, -0.568)
    constructor(pos = new Vector3(-17, 8, 12), front = new Vector3(0.811, -0.14, -0.568), up = new Vector3(0, 1, 0))
    {
        super(false, pos);
        this.fov = 120;
        this.far = 1000;
        this.near = 0.5;
        //this.target = target; // this.pos + this.front
        this.up = up;
        this.viewMatrix = null;

        this.front = front;
        this.speed = 0;

        // the front vector DOESN'T Matter we catculated by the pitsh & yaw
        this.pitch = -8; // 0
        this.yaw = -35; // -90
    }
    
    // v means point in space
    getDirection(v)
    {
        return Math3d.normalize(this.pos.sub(v));
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
        //this.info();

        this.speed = 3 * game.timestamp;
        // move front
        if (game.input.keypress(Keyboard.KEY_Z))
        {
            //console.log('Go front');
            this.pos = this.pos.add(this.front.multi(this.speed * 5));
        }
        // move back
        if (game.input.keypress(Keyboard.KEY_S))
        {
            //console.log('Go back');
            this.pos = this.pos.sub(this.front.multi(this.speed * 5));
        }

        // move Right
        if (game.input.keypress(Keyboard.KEY_D))
        {
            //console.log('Go right');
            this.pos = this.pos.add(Math3d.normalize(this.front.cross(this.up)).multi(this.speed * 5));
        }
        // move left
        if (game.input.keypress(Keyboard.KEY_Q))
        {
            //console.log('Go left');
            this.pos = this.pos.sub(Math3d.normalize(this.front.cross(this.up)).multi(this.speed * 5));
        }

        // for Camera direction
        // look up
        if (game.input.keypress(Keyboard.KEY_ARROW_UP)) {
            //console.log('pitch Rotate Camera');
            this.pitch += this.speed * 15;
        }

        // look down
        if (game.input.keypress(Keyboard.KEY_ARROW_DOWN)) {
            //console.log('pitch Rotate Camera');
            this.pitch -= this.speed * 15;
        }
        
        // turn right
        if (game.input.keypress(Keyboard.KEY_ARROW_RIGHT)) {
            //console.log('yaw Rotate Camera');
            this.yaw += this.speed * 15;
        }

        // turn left
        if (game.input.keypress(Keyboard.KEY_ARROW_LEFT)) {
            //console.log('yaw Rotate Camera');
            this.yaw -= this.speed * 15;
        }

        this.updateViewMatrix();
    }

    info()
    {
        console.log('----------- Camera info -----------');
        console.log(`Position: ${this.pos.x}, ${this.pos.y}, ${this.pos.z}`);
        console.log(`Front: ${this.front.x}, ${this.front.y}, ${this.front.z}`);
        console.log('Pitch: ' + this.pitch);
        console.log('Yaw: ' + this.yaw);
    }
}