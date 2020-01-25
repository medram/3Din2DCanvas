import Game from './game.js'
import Cube from './cube.js'
import * as util from './utils.js';
import { Vector4, Vector3, Vector2 } from './math3d.js';
import Entity from './entity.js';
import Colors from './colors.js'
import Light from './light.js'
import { Camera } from './camera.js'

// init resizing canvas
window.onload = function (){

	main();
};

function main()
{
	const camera = new Camera(new Vector3(-15.5, 8, 17), 0, -45)
	const game = new Game('my-canvas', camera);
	window.game = game
	
	const test = new Entity('monkey.obj', new Vector3(0, 5, 0), Colors.WHITE);
	const cube = new Entity('cube.obj', new Vector3(0, 1, 0), Colors.YELLOW);
	const obj = new Entity('exampleOBJ.obj', new Vector3(0, 0, -10), Colors.PURPLE);
	const obj2 = new Entity('lamp.obj', new Vector3(-2, 0, -5), Colors.YELLOW);
	const obj3 = new Entity('lowPolyTree.obj', new Vector3(6, 0, -7), Colors.GREEN);
	const obj4 = new Entity('pine.obj', new Vector3(-7, 0, -7), Colors.GREEN);
	const obj5 = new Entity('stall.obj', new Vector3(10, 0, 0), Colors.BLUE);
	const plane = new Entity('plane2.obj', new Vector3(1, 0, 1), Colors.BLUE);

	const light = new Light(new Vector4(1, -1, 0, 1), new Vector4(5, 5, -5, 1))

	game.world.setLight(light);
	//game.world.drawable.push(light);
	//game.world.updateable.push(light);
	

	game.world.drawable.push(cube);
	game.world.updateable.push(cube);
	
	game.world.drawable.push(plane)
	game.world.updateable.push(plane)

	obj.rotate(-130, new Vector3(0, 1, 0))
	game.world.drawable.push(obj);
	game.world.updateable.push(obj);
	
	game.world.drawable.push(obj2);
	game.world.updateable.push(obj2);
	
	game.world.drawable.push(obj3);
	game.world.updateable.push(obj3);

	game.world.drawable.push(obj4);
	game.world.updateable.push(obj4);


	//test.setScale(0.2)
	//test.rotate(-90, new Vector3(1, 0, 0))
	game.world.drawable.push(test);
	game.world.updateable.push(test);


	obj5.rotate(90, new Vector3(0, 1, 0))
	game.world.drawable.push(obj5);
	game.world.updateable.push(obj5);

	let angleSpeed = 15; // 30 degrees per second
	let totalAngle = 10;
	game.loop(function (){
		this.update();
		totalAngle = (angleSpeed * this.timestamp);
		//test.rotate(totalAngle, new Vector3(0, 0, 1));
		test.rotate(totalAngle, new Vector3(0, 1, 0));
		cube.rotate(totalAngle, new Vector3(0, 1, 0));
		light.rotate(totalAngle, new Vector3(0, 1, 0));
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

