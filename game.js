import World from './world.js'
import Render from './render.js';
import { Vector3, Vector2 } from './math3d.js';
import Input from './input.js';
import Configs from './configs.js';


export default class Game {
    constructor(id) {
        
        this.fps = 30;
        this.interval = 1000 / this.fps;
        
        this.now;
        this.then = Date.now();
        this.delta = 0;
        
        this.timestamp = 0;
        this.frames = 0;
        this.oldTime = 0;
        
        this.run = false;
        
        this.center = 0;
        
        this.render = new Render(this);
        this.input = new Input(this);
        this.init(id);
        this.world = new World(this);
    }

    init(id)
    {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight-4;

        this.center = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillStyle = Configs.render.fillStyle; // #8CC152 Green
        this.ctx.strokeStyle = Configs.render.strokeStyle;
        this.ctx.font = Configs.render.font;

        // Capture inputs
        //window.addEventListener('keypress', this.input.capturePressKeys.bind(this.input));
        window.addEventListener('keydown', this.input.capturnDownKeys.bind(this.input));
        window.addEventListener('keyup', this.input.capturnUpKeys.bind(this.input));
    }

    loop(callback) {
        console.log('Game started');
        this.run = true;
        
        if (typeof callback === 'function')
        {
            // this is the game loop
            this.callback = () => {
                this.now = Date.now();
                this.delta = this.now - this.then;
                //this.then = this.now;
                
                if (this.run && this.delta >= this.interval)
                {
                    this.then = this.now - (this.delta % this.interval);
                    // calculate the timestamp
                    this.timestamp = (Date.now() - this.oldTime) / 1000;
                    // calculate the FPS 
                    this.frames = 1000 / (Date.now() - this.oldTime);
                    this.oldTime = Date.now();
                    
                    this.render.clear();
                    callback.call(this); 
                    this.input.clear();
                }
                this.refresh();
            };
            
            // this runs just once
            this.refresh();
        }
    }

    update()
    {
        this.input.update();
        this.world.update();
    }
    
    draw()
    {
        this.world.draw();
    }

    refresh()
    {
        if (this.run === true)
        {
            window.requestAnimationFrame(this.callback);
        }
    }

    stop()
    {
        this.run = false;
    }

    start()
    {
        this.run = true;
        this.refresh();
    }
}