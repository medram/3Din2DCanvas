import { Vector3 }  from './math3d.js'
import * as Math3d from './math3d.js'
import * as util from './utils.js';
import Colors from './colors.js'

import Mesh from './mesh.js'

export default class Entity {
    constructor(objFileName = false, pos = false, fillStyleColor = '') {
        // the center of the OBJ
        this.pos = typeof pos === 'object' ? pos : new Vector3();
        this.mesh = objFileName ? new Mesh(objFileName) : false;
        this.modelMatrix = Math3d.translate(Math3d.rotate(Math3d.scale(Math3d.mat4(1.0), 1), Math3d.radians(0), new Vector3(0, 1, 0)), this.pos);
        this.newVertices = [];
        this.fillStyleColor = fillStyleColor
    }
    
    update(game)
    {
    }
    
    draw(game)
    {
        // to world coordinates (using Model Matrix)
        this.newVertices = this.mesh.vertices.map(v => {
            return this.modelMatrix.multiVector(v);
        });
        
        // to camera coordinates (using View Matrix)
        let tmpV;
        this.newVertices = this.newVertices.map(v => {
            tmpV = game.world.camera.getViewMatrix().multiVector(v);
            //tmpV.w = 1;
            return tmpV;
        });

        /*        let list = [];
        let camera = game.world.camera;
        
        // to world coordinates (using Model Matrix)
        list = this.mesh.vertices.map(v => {
            return this.modelMatrix.multiVector(v);
        });

        // to camera coordinates (using View Matrix)
        let tmpV;
        list = list.map(v => {
            tmpV = game.world.camera.getViewMatrix().multiVector(v);
            tmpV.w = 1;
            return tmpV;
        });
        
        //console.log(list);
        // projection (Perspective projection)
        let projectionMatrix = Math3d.perspective(Math3d.radians(camera.fov), game.canvas.width / game.canvas.height, camera.near, camera.far);
        let tmp;
        list = list.map(v => {
            tmp = projectionMatrix.multiVector(v);
            tmp.x /= tmp.w;
            tmp.y /= tmp.w;
            tmp.z /= tmp.w;
            tmp.w = 1;
            return tmp;
        });

        //let listTr1 = this.triangles;
        let polygonsList = this.mesh.getPolygon(list);
        //console.log(typeof polygonsList[0].v4);

        // this is a Triangle
        if (typeof polygonsList[0].v4 === 'undefined') {
            // sorting triangles
            polygonsList.sort(function (tr1, tr2) {
                return util.avgTrZ(tr1) - util.avgTrZ(tr2);
            });

            // render the triangles
            polygonsList.forEach(tr => {
                game.render.renderTriangle(game.render.screenSpaceTr(tr));
            });
        } else {
            // this is a Quatrant
            polygonsList.sort(function (quad1, quad2) {
                return util.avgQuadZ(quad1) - util.avgQuadZ(quad2);
            });

            // render a Quadrant
            polygonsList.forEach(quad => {
                game.render.renderQuadrant(game.render.screenSpaceQuad(quad));
            });
        } */
    }
    
    rotate(angle, axe)
    {
        if (typeof angle == 'number' && typeof axe == 'object')
            this.modelMatrix = Math3d.translate(Math3d.rotate(Math3d.scale(Math3d.mat4(1.0), 1), Math3d.radians(angle), axe), this.pos);
    }

    getModelMatrix()
    {
        return this.modelMatrix;
    }

    getPolygons()
    {
        if (this.mesh !== false)
            return this.mesh.getPolygons(this.newVertices);
        
        return [];
    }
}