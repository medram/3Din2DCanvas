import  * as Math3d from './math3d.js'
import { Vector3 } from './math3d.js';
import Vector4 from './math3d.js';
import Entity from './entity.js';

export class Camera extends Entity
{
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
        if (game.input.keypress(game.input.Keyboard.KEY_Z))
        {
            //console.log('Go front');
            this.pos = this.pos.add(this.front.multi(this.speed));
        }
        // move back
        if (game.input.keypress(game.input.Keyboard.KEY_S))
        {
            //console.log('Go back');
            this.pos = this.pos.sub(this.front.multi(this.speed));
        }

        // move Right
        if (game.input.keypress(game.input.Keyboard.KEY_D))
        {
            //console.log('Go right');
            this.pos = this.pos.add(Math3d.normalize(this.front.cross(this.up)).multi(this.speed));
        }
        // move left
        if (game.input.keypress(game.input.Keyboard.KEY_Q))
        {
            //console.log('Go left');
            this.pos = this.pos.sub(Math3d.normalize(this.front.cross(this.up)).multi(this.speed));
        }

        // for Camera direction
        // look up
        if (game.input.keypress(game.input.Keyboard.KEY_8)) {
            //console.log('pitch Rotate Camera');
            this.pitch += this.speed * 10;
        }

        // look down
        if (game.input.keypress(game.input.Keyboard.KEY_5)) {
            //console.log('pitch Rotate Camera');
            this.pitch -= this.speed * 10;
        }
        
        // turn right
        if (game.input.keypress(game.input.Keyboard.KEY_6)) {
            //console.log('yaw Rotate Camera');
            this.yaw += this.speed * 10;
        }

        // turn left
        if (game.input.keypress(game.input.Keyboard.KEY_4)) {
            //console.log('yaw Rotate Camera');
            this.yaw -= this.speed * 10;
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