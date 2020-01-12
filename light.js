import { Vector3 } from './math3d.js'
import Entity from './entity.js'
import * as Math3d from './math3d.js'
import Colors from './colors.js'
import Traingle from './triangle.js'

export default class Light extends Entity {

	constructor(direction = new Vector3(0, 0, 0), pos = new Vector3(0, 0, 0))
	{
		super('cube.obj', pos, Colors.YELLOW)
		this._dir = Math3d.normalize(direction)
		this.direction = Math3d.normalize(direction)
		//this.modelMatrix = Math3d.translate(Math3d.rotate(Math3d.scale(Math3d.mat4(1.0), 1), Math3d.radians(0), new Vector3(0, 1, 0)), this.pos)
	}

	draw(game)
	{
        super.draw(game)
		
		// To world coordinates (using Model Matrix)
        this.direction = Math3d.normalize(this.modelMatrix.multiVector(this._dir))
        
        // To camera coordinates (using View Matrix)
        this.direction = Math3d.normalize(game.world.camera.getViewMatrix().multiVector(this.direction)) 
	}

	getDirection()
	{
		//return Math3d.perpendicularOnTr(new Traingle(this.newVertices[0], this.newVertices[1], this.newVertices[2]))
		return this.direction
	}
}