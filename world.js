import { Camera } from "./camera.js";
import Vector4, { Vector3 } from "./math3d.js";
import * as util from './utils.js';
import * as Math3d from "./math3d.js";
import Configs from "./configs.js";

export default class World
{
    constructor(game, camera)
    {
        this.updateable = [];
        this.drawable = [];
        this.game = game;
        this.camera = camera;
        this.polygonsList = [];
        this.projectionMatrix = null
        this.lights = []
        this.init();
    }

    init()
    {
        this.updateable.push(this.camera);
        //this.initZbuffer();
    }

    setLight(light)
    {
        this.lights.push(light)
        this.updateable.push(light)
        this.drawable.push(light)
    }

    update()
    {
        this.updateable.map(obj => {
            obj.update(this.game);
        })
    }
    
    draw()
    {
        this.projectionMatrix = Math3d.perspective(Math3d.radians(this.camera.fov), this.game.canvas.width / this.game.canvas.height, this.game.world.camera.near, this.game.world.camera.far);

        this.drawable.map(obj => {
            if (obj.mesh.found)
            {
                obj.draw(this.game);
                //this.game.render.renderEntity(obj)
                //this.polygonsList = this.polygonsList.concat(obj.getPolygons());
            }
        });
        
        this.game.render.renderWorld(this.drawable)
    }
}