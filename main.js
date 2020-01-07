import Game from './game.js'
import Cube from './cube.js'
import * as util from './utils.js';
import { Vector3, Vector2 } from './math3d.js';
import Entity from './entity.js';

// init resizing canvas
window.onload = function (){

	main();
};

function main()
{
	let game = new Game('my-canvas');
	let cube = new Entity('cube.obj', new Vector3(0, 0, -3));
	let obj = new Entity('exampleOBJ.obj', new Vector3(2, 0, 4));
	let obj2 = new Entity('lamp.obj', new Vector3(-2, 0, -6));
	let obj3 = new Entity('lowPolyTree.obj', new Vector3(6, 0, -7));
	let obj4 = new Entity('pine.obj', new Vector3(-7, 0, -7));
	let obj5 = new Entity('stall.obj', new Vector3(-2, 0, -12));
	let plane = new Entity('plane2.obj', new Vector3(-2, 0, -1));

	game.world.drawable.push(cube);
	game.world.updateable.push(cube);
	
	game.world.drawable.push(plane);
	game.world.updateable.push(plane);

	game.world.drawable.push(obj);
	game.world.updateable.push(obj);
	
	game.world.drawable.push(obj2);
	game.world.updateable.push(obj2);
	
	game.world.drawable.push(obj3);
	game.world.updateable.push(obj3);

	game.world.drawable.push(obj4);
	game.world.updateable.push(obj4);

	game.world.drawable.push(obj5);
	game.world.updateable.push(obj5);

	let angleSpeed = 15; // 30 degrees per second
	let totalAngle = 0;
	game.loop(function (){
		//totalAngle += (angleSpeed * this.timestamp);
		
		//console.log('fps:' + Math.round(this.frames, 2));
		//cube.rotate(totalAngle, new Vector3(0, 1, 0));
		this.update();
		this.draw();
		//this.stop();
	});

	/* function init()
	{
		let center = new Vertex(canvas.width / 2, canvas.height / 2);
		ctx.translate(canvas.width / 2, canvas.height / 2);
		canvas.width = document.documentElement.clientWidth;
		canvas.height = document.documentElement.clientHeight;
	} */
}

