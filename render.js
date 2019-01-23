import { Vector2, Quadrant } from "./math3d.js";
import Triangle from "./Triangle.js";
import Configs from "./configs.js";

export default class Render
{
    constructor(game)
    {
        this.game = game;
    }

/*     renderWorld()
    {

    }
 */
    renderTriangle(tr) {
        //console.log(tr);
        
        this.game.ctx.beginPath();
        this.game.ctx.lineWidth = Configs.render.lineWidth;
        this.game.ctx.moveTo(tr.v1.x, tr.v1.y);
        this.game.ctx.lineTo(tr.v2.x, tr.v2.y);
        this.game.ctx.lineTo(tr.v3.x, tr.v3.y);
        //this.game.ctx.closePath();
        this.game.ctx.lineTo(tr.v1.x, tr.v1.y);
        if(Configs.render.fill)
            this.game.ctx.fill();
        this.game.ctx.stroke();
    }
    
    renderQuadrant(quad)
    {
        this.game.ctx.beginPath();
        this.game.ctx.lineWidth = Configs.render.lineWidth;
        this.game.ctx.moveTo(quad.v1.x, quad.v1.y);
        this.game.ctx.lineTo(quad.v2.x, quad.v2.y);
        this.game.ctx.lineTo(quad.v3.x, quad.v3.y);
        this.game.ctx.lineTo(quad.v4.x, quad.v4.y);
        //this.game.ctx.closePath();
        this.game.ctx.lineTo(quad.v1.x, quad.v1.y);
        if (Configs.render.fill)
            this.game.ctx.fill();
        this.game.ctx.stroke();

    }

    screenSpace(v)
    {
        return new Vector2(
            this.game.canvas.width * v.x * 0.5,
            this.game.canvas.height * -v.y * 0.5
        );
    }

    screenSpaceTr(tr)
    {
        /* if (tr.v1.z > 0 || tr.v2.z > 0 || tr.v3.z > 0)
            console.log(tr);
         *///console.log(tr.v1.z);

        return new Triangle(
            this.screenSpace(tr.v1),
            this.screenSpace(tr.v2),
            this.screenSpace(tr.v3)
        );
        //return tr;
    }

    screenSpaceQuad(quad)
    {
        return new Quadrant(
            this.screenSpace(quad.v1),
            this.screenSpace(quad.v2),
            this.screenSpace(quad.v3),
            this.screenSpace(quad.v4)
        );
    }

    renderPoint(v)
    {
        this.game.ctx.lineTo(v.x, v.y);
    }

    clear()
    {
        this.game.ctx.clearRect(-this.game.canvas.width / 2, -this.game.canvas.height / 2, this.game.canvas.width, this.game.canvas.height);
    }


}