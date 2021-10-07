import  * as Math3d from './math3d.js'
import { Vector3 } from './math3d.js';
import Vector4 from './math3d.js';
import Entity from './entity.js';
import Keyboard from "./keyboard.js";
import Triangle from "./triangle.js";


export class Camera extends Entity
{
    constructor(pos = new Vector3(0, 0, 0), pitch = 0, yaw = -90, fov=75)
    {
        super(false, pos);
        this.fov = fov;
        this.far = 1000;
        this.near = 1;
        //this.target = target; // this.pos + this.front
        this.up = new Vector3(0, 1, 0);
        this.front = new Vector3(0, 0, 1);
        this.viewMatrix = null;
        this.speed = 0;

        // the front vector DOESN'T Matter we catculated by the pitsh & yaw.
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

    get4PlanesNormals(w, h)
    {
        // let w = this.game.canvas.width
        // let h = this.game.canvas.height
        // let wh = w / h // ratio

        const hw = h / w
        let tangent = Math.tan(this.fov / 2 * Math3d.DEG2RAD)
        let half_width = this.near * tangent
        let half_height = half_width * hw

        // right
        let t = new Triangle()
        t.v1 = new Vector3(0, 0, 0)
        t.v2 = new Vector3(half_width, half_height, -this.near)
        t.v3 = new Vector3(half_width, 0, -this.near)

        // left
        let t2 = new Triangle()
        t2.v1 = new Vector3(0, 0, 0)
        t2.v2 = new Vector3(-half_width, 0, -this.near)
        t2.v3 = new Vector3(-half_width, half_height, -this.near)

        // top
        let t3 = new Triangle()
        t3.v1 = new Vector3(0, 0, 0)
        t3.v2 = new Vector3(0, half_height, -this.near)
        t3.v3 = new Vector3(half_width, half_height, -this.near)

        // buttom
        let t4 = new Triangle()
        t4.v1 = new Vector3(0, 0, 0)
        t4.v2 = new Vector3(half_width, -half_height, -this.near)
        t4.v3 = new Vector3(0, -half_height, -this.near)


        // all plane normals
        let rightNormal = Math3d.perpendicularOnTr(t)
        let leftNormal = Math3d.perpendicularOnTr(t2)
        let topNormal = Math3d.perpendicularOnTr(t3)
        let buttomNormal = Math3d.perpendicularOnTr(t4)

        return [topNormal, rightNormal, buttomNormal, leftNormal]
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
            this.pitch += this.speed * 10;
        }

        // look down
        if (game.input.keypress(Keyboard.KEY_ARROW_DOWN)) {
            //console.log('pitch Rotate Camera');
            this.pitch -= this.speed * 10;
        }

        // turn right
        if (game.input.keypress(Keyboard.KEY_ARROW_RIGHT)) {
            //console.log('yaw Rotate Camera');
            this.yaw += this.speed * 10;
        }

        // turn left
        if (game.input.keypress(Keyboard.KEY_ARROW_LEFT)) {
            //console.log('yaw Rotate Camera');
            this.yaw -= this.speed * 10;
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
