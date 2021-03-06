import { Vector3 }  from './math3d.js'
import * as Math3d from './math3d.js'
import * as util from './utils.js';
import Colors from './colors.js'

import Mesh from './mesh.js'

export default class Entity {
    constructor(objFileName = false, pos = false, fillStyleColor = '') {
        // the center of the OBJ
        
        this.scaleValue = 1
        this.pos = typeof pos === 'object' ? pos : new Vector3()
        this.mesh = objFileName ? new Mesh(objFileName) : false
        this.modelMatrix = null
        this.newVertices = []
        this.newNormals = []
        this.newPos = this.pos
        this.fillStyleColor = fillStyleColor
        this.rotations = []

        this.updateModelMatrix()
    }
    
    update(game)
    {
        this.updateModelMatrix()
    }
    
    updateModelMatrix()
    {
        this.modelMatrix = Math3d.scale(Math3d.mat4(1.0), this.scaleValue)
        this.rotations.map(rotation => {
            this.modelMatrix = Math3d.rotate(this.modelMatrix, Math3d.radians(rotation.angle), rotation.axe)
        })
        this.modelMatrix = Math3d.translate(this.modelMatrix, this.pos)
    }

    draw(game)
    {
        //====================== Position =========================
        //this.newPos = this.modelMatrix.multiVector(this.pos)
        //this.newPos = game.world.camera.getViewMatrix().multiVector(this.newPos)

        //====================== Vertices =========================
        // To world coordinates (using Model Matrix)
        this.newVertices = this.mesh.vertices.map(v => {
            return this.modelMatrix.multiVector(v);
        });
        
        // To camera coordinates (using View Matrix)
        this.newVertices = this.newVertices.map(v => {
            return game.world.camera.getViewMatrix().multiVector(v);
        });

        //====================== Normals ==========================
        // To world coordinates (using Model Matrix)
        this.newNormals = this.mesh.normals.map(v => {
            return Math3d.normalize(this.modelMatrix.multiVector(v));
        });
        
        // To camera coordinates (using View Matrix)
        this.newNormals = this.newNormals.map(v => {
            return Math3d.normalize(game.world.camera.getViewMatrix().multiVector(v));
        });
    }
    
    rotate(angle, axe)
    {
        if (typeof angle == 'number' && typeof axe == 'object')
            this.rotations.push({angle: angle, axe: axe})
            //this.modelMatrix = Math3d.rotate(this.modelMatrix, Math3d.radians(angle), axe)
    }

    setScale(value)
    {
        if (value > 0)
            this.scaleValue = value
    }

    getModelMatrix()
    {
        return this.modelMatrix;
    }

    getPolygons()
    {
        if (this.mesh)
            return this.coloratePolygons();
        
        return [];
    }
    
    getNormals()
    {
        return this.newNormals || []
    }

    getFaces()
    {
        return this.mesh.faces
    }

    getPosition()
    {
        return this.newPos
    }

    // Add Colors to Polygons.
    coloratePolygons()
    {
        return this.mesh.getPolygons(this.newVertices).map(pol => {
            pol.color = this.fillStyleColor
            return pol
        })
    }
}