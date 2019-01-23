import { Camera } from "./camera.js";
import * as util from './utils.js';
import Vector4, { Vector3 } from "./math3d.js";
import * as Math3d from "./math3d.js";

export default class World
{
    constructor(game)
    {
        this.updateable = [];
        this.drawable = [];
        this.game = game;
        this.camera = new Camera();
        this.polygonsList = [];

        this.ZBuffer = [];
        this.Frame = [];

        this.init();
    }

    init()
    {
        this.updateable.push(this.camera);
        //this.initZbuffer();
    }

/*     initZbuffer()
    {
        for (let i = 0; i < this.game.canvas.width; ++i)
        {
            for (let j = 0; j < this.game.canvas.height; ++j)
            {
                this.ZBuffer[i][j] = 0;
            }
        }
    } */

    update()
    {
        this.updateable.forEach(obj => {
            obj.update(this.game);
        });
    }
    
    draw()
    {
        let projectionMatrix = Math3d.perspective(Math3d.radians(this.game.world.camera.fov), this.game.canvas.width / this.game.canvas.height, this.game.world.camera.near, this.game.world.camera.far);

        this.drawable.forEach(obj => {
            if (obj.mesh.found)
            {
                obj.draw(this.game);
                this.polygonsList = this.polygonsList.concat(obj.getPolygons());
            }
        });

        //let newList = [];
        let out = [];
        let planeNormal;
        //-------------- for near plane ---------------
        this.polygonsList.forEach(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, -0.6), new Vector3(0, 0, -1), pol, out);
            //newList = newList.concat(out);
            //out = [];
        });

        this.polygonsList = out;
        out = [];
        
        //-------------- for far plane ---------------
        this.polygonsList.forEach(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, -this.camera.far), new Vector3(0, 0, 1), pol, out);
        });
        
        this.polygonsList = out;
        out = [];
        
        //-------------- left plane ---------------
        planeNormal = projectionMatrix.reverse().multiVector(new Vector4(-1, 0, 0, 1));
        this.polygonsList.forEach(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
        });
        
        this.polygonsList = out;
        out = [];

        //-------------- right plane ---------------
        planeNormal = projectionMatrix.reverse().multiVector(new Vector4(1, 0, 0, 1));
        this.polygonsList.forEach(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
        });

        this.polygonsList = out;
        out = [];

        //-------------- top plane ---------------
        planeNormal = projectionMatrix.reverse().multiVector(new Vector4(0, -1, 0, 1));
        this.polygonsList.forEach(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
        });

        this.polygonsList = out;
        out = [];

        //-------------- buttom plane ---------------
        planeNormal = projectionMatrix.reverse().multiVector(new Vector4(0, 1, 0, 1));
        this.polygonsList.forEach(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
        });

        this.polygonsList = out;
        out = [];

        //console.log('w=' + this.polygonsList[0].v1.w);

        //-------------- projection (Perspective projection) -------------
        this.polygonsList = this.polygonsList.map(pol => {

            pol.v1 = projectionMatrix.multiVector(pol.v1);
            pol.v1.x /= pol.v1.w;
            pol.v1.y /= pol.v1.w;
            pol.v1.z /= pol.v1.w;
            
            pol.v2 = projectionMatrix.multiVector(pol.v2);
            pol.v2.x /= pol.v2.w;
            pol.v2.y /= pol.v2.w;
            pol.v2.z /= pol.v2.w;
            
            pol.v3 = projectionMatrix.multiVector(pol.v3);
            pol.v3.x /= pol.v3.w;
            pol.v3.y /= pol.v3.w;
            pol.v3.z /= pol.v3.w;

            return pol;
        });

        //console.log('Polygons: ' + this.polygonsList.length);
        // sort Polygons
        this.polygonsList.sort(function (pol1, pol2) {
            // for triangles
            if (typeof pol1.v4 === 'undefined' && typeof pol2.v4 === 'undefined')
                return util.avgTrZ(pol1) - util.avgTrZ(pol2);
            // for quadrants
            else if (typeof pol1.v4 !== 'undefined' && typeof pol2.v4 !== 'undefined')
                return util.avgQuadZ(pol1) - util.avgQuadZ(pol2);
            // for mix
            else if (typeof pol1.v4 === 'undefined' && typeof pol2.v4 !== 'undefined')
                return util.avgTrZ(pol1) - util.avgQuadZ(pol2);
            else
                return util.avgQuadZ(pol1) - util.avgTrZ(pol2);    
        });

        // render a Polygons
        this.polygonsList.forEach(pol => {
            if (typeof pol.v4 === 'undefined')
                this.game.render.renderTriangle(this.game.render.screenSpaceTr(pol));
            else
                this.game.render.renderQuadrant(this.game.render.screenSpaceQuad(pol));
        });

        // clear the list
        this.polygonsList = [];
    }

    /* sortObject()
    {
        this.drawable.sort((obj1, obj2) => {
            return obj1.pos.z - obj2.pos.z;
        });
    } */
}