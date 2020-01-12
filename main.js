import Game from './game.js'
import Cube from './cube.js'
import * as util from './utils.js';
import { Vector4, Vector3, Vector2 } from './math3d.js';
import Entity from './entity.js';
import Colors from './colors.js'
import Light from './light.js'

// init resizing canvas
window.onload = function (){

	main();
};

function main()
{
	const game = new Game('my-canvas');
	const cube = new Entity('cube.obj', new Vector4(0, 0, 0, 1), Colors.GREEN);
	const obj = new Entity('exampleOBJ.obj', new Vector4(2, 0, 4, 1));
	//const obj2 = new Entity('lamp.obj', new Vector4(-2, 0, -6, 1), Colors.YELLOW);
	//new Vector4(6, 0, -7, 1)
	const obj3 = new Entity('lowPolyTree.obj', new Vector4(6, 0, -7, 1), Colors.BLUE);
	//const obj4 = new Entity('pine.obj', new Vector4(-7, 0, -7, 1));
	//const obj5 = new Entity('stall.obj', new Vector4(-2, 0, -12, 1));
	const plane = new Entity('cube.obj', new Vector4(1, 1, 1, 1), Colors.BLUE);

	const light = new Light(new Vector4(1, -1, 0, 1), new Vector4(5, 5, -5, 1))

	game.world.setLight(light);
	//game.world.drawable.push(light);
	//game.world.updateable.push(light);
	

	game.world.drawable.push(cube);
	game.world.updateable.push(cube);
	
	game.world.drawable.push(plane)
	game.world.updateable.push(plane)

/*	game.world.drawable.push(obj);
	game.world.updateable.push(obj);
*/	
/*	game.world.drawable.push(obj2);
	game.world.updateable.push(obj2);*/
	
	game.world.drawable.push(obj3);
	game.world.updateable.push(obj3);

/*	game.world.drawable.push(obj4);
	game.world.updateable.push(obj4);*/


/*	game.world.drawable.push(obj5);
	game.world.updateable.push(obj5);*/

	let angleSpeed = 15; // 30 degrees per second
	let totalAngle = 10;
	game.loop(function (){
		totalAngle += (angleSpeed * this.timestamp);
		
		//console.log('fps:' + Math.round(this.frames, 2));
		light.rotate(totalAngle, new Vector3(0, 1, 0));
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

