import { Vector2, Vector3, Vector4, Quadrant } from "./math3d.js";
import Triangle from "./Triangle.js";
import Configs from "./configs.js";
import * as Math3d from "./math3d.js";
import * as util from './utils.js';
import Colors from './colors.js'

export default class Render
{
    constructor(game)
    {
        this.game = game;
        this.Z_Buffer = null
        this.FrameBuffer = null
        this.MAX_ZBUFFER_SIZE = -Infinity
        this.DEFAULT_FRAMEBUFFER_COLOR = Colors.BLACK
        //this.objects = this.game.world
        
        this.init_ZBuffer()
        this.init_FrameBuffer()
    }

    // must be initilized with Infinty number
    init_ZBuffer()
    {
        this.Z_Buffer = new Array(this.game.canvas.width).fill(new Array(this.game.canvas.height).fill(this.MAX_ZBUFFER_SIZE))
/*        this.Z_Buffer = []
        let tmp = null
        for (let x = 0; x < this.game.canvas.width; ++x)
        {
            tmp = []
            for (let y = 0; y < this.game.canvas.height; ++y)
                tmp.push(Colors.BLACK)
            this.Z_Buffer.push(tmp)
        }*/
    }

    // must be initilized with black color
    init_FrameBuffer()
    {
        let width = this.game.canvas.width
        let height = this.game.canvas.height

        this.FrameBuffer = (new Array(width).fill(0)).map((item) => {
            return new Array(height).fill(this.DEFAULT_FRAMEBUFFER_COLOR)
        })

/*        this.FrameBuffer = new Array(width)
        for (let x = 0; x < width; ++x)
            for (let y = 0; y < height; ++y)
                this.FrameBuffer[x][y] = color*/

/*        this.FrameBuffer = new Array(this.game.canvas.width).fill(0)
        this.FrameBuffer = this.FrameBuffer.map(item => {
            return new Array(this.game.canvas.height).fill(Colors.BLACK)
        })*/

        /*if (this.FrameBuffer === null)
        {
            //console.log('create buffer')
            this.FrameBuffer = new Array(this.game.canvas.width).fill(0)
            this.FrameBuffer = this.FrameBuffer.map(item => {
                return new Array(this.game.canvas.height).fill(Colors.BLACK)
            })
        }
        else
        {
            //console.log('refill')
            for (let x = 0; x < this.game.canvas.width; ++x)
                for (let y = 0; y < this.game.canvas.height; ++y)
                    this.FrameBuffer[x][y] = Colors.BLACK
        }*/
    }

    clearBuffers()
    {
        this.clearZBuffer()  
        this.clearFrameBuffer()      
    }

    clearZBuffer()
    {
        this.Z_Buffer = this.Z_Buffer.map((xColumn) => xColumn.map((z) => this.MAX_ZBUFFER_SIZE))
    }

    clearFrameBuffer()
    {
        this.FrameBuffer = this.FrameBuffer.map((colorsColumn) => colorsColumn.map((color) => this.DEFAULT_FRAMEBUFFER_COLOR))
    }

    // Render the FrameBuffer to the Screen
    renderFrameBuffer()
    {
        let imgData = this.game.ctx.createImageData(this.game.canvas.width, this.game.canvas.height)

        let color = null
        let i = 0
        for (let y = 0; y < this.game.canvas.height; ++y)
        {
            for (let x = 0; x < this.game.canvas.width; ++x)
            {
                color = this.FrameBuffer[x][y]
                imgData.data[i+0] = color[0]
                imgData.data[i+1] = color[1]
                imgData.data[i+2] = color[2]
                imgData.data[i+3] = color[3]
                i+=4
            }
        }

        this.game.ctx.putImageData(imgData, 0, 0)

        /*
        this.FrameBuffer.map((colorsColumn, x) => {
            colorsColumn.map((color, y) => {
                this.game.ctx.fillStyle = color
                this.game.ctx.fillRect(x, y, 1, 1)
            })
        })*/
    }

    renderWorld(objs)
    {
        objs.map(obj => {
            this.renderEntity(obj)
        })
        this.renderFrameBuffer()
        this.clearBuffers()
    }

    renderEntity(obj)
    {
        let polygonsList = obj.getPolygons()
        let normalsList = obj.getNormals()
        let facesList = obj.getFaces()


        //################### Clipping the poligons to rediuce  ####################
        //let newList = [];
        let out = [];
        let planeNormal;
        //-------------- for near plane ---------------
        polygonsList.map(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, -0.6), new Vector3(0, 0, -1), pol, out);
            //newList = newList.concat(out);
            //out = [];
        });

        polygonsList = out;
        out = [];
        
        //-------------- for far plane ---------------
        polygonsList.map(pol => {
            Math3d.clipAgainstPlane(new Vector3(0, 0, -this.game.world.camera.far), new Vector3(0, 0, 1), pol, out);
        });
        
        polygonsList = out;
        out = [];
        
        if (Configs.render.clipping)
        {
            //-------------- left plane ---------------
            planeNormal = this.game.world.projectionMatrix.reverse().multiVector(new Vector4(-1, 0, 0, 1));
            polygonsList.map(pol => {
                Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
            });
            
            polygonsList = out;
            out = [];
            
            //-------------- right plane ---------------
            planeNormal = this.game.world.projectionMatrix.reverse().multiVector(new Vector4(1, 0, 0, 1));
            polygonsList.map(pol => {
                Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
            });
            
            polygonsList = out;
            out = [];
            
            //-------------- top plane ---------------
            planeNormal = this.game.world.projectionMatrix.reverse().multiVector(new Vector4(0, -1, 0, 1));
            polygonsList.map(pol => {
                Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
            });
            
            polygonsList = out;
            out = [];
            
            //-------------- buttom plane ---------------
            planeNormal = this.game.world.projectionMatrix.reverse().multiVector(new Vector4(0, 1, 0, 1));
            polygonsList.map(pol => {
                Math3d.clipAgainstPlane(new Vector3(0, 0, 0), planeNormal, pol, out);
            });
            
            polygonsList = out;
            out = [];  
        }
        //console.log('w=' + polygonsList[0].v1.w);

        //################### From Now on You Are Dealing just with poligons on the screen #################
        
        //-------------- Tweak the contrast of pols' color -------------
        let width = this.game.canvas.width
        let height = this.game.canvas.height

        let lightEntity = this.game.world.lights[0]
        // choose just the first normal
        let lightSource = lightEntity.getNormals()[0]
        
        let perp = null
        let contrast = null
        let color = null
        polygonsList.map((pol, i) => {
            //perp = normalsList[facesList[i].vn[0]-1]
            perp = normalsList[pol.face.vn[0]-1]
            //if (!perp) console.log(pol.face)
            contrast = (perp.dot(lightSource)+1)*0.5
            color = (contrast*220+20).toFixed(0) // the color range should be 0~255 (but 15~240 is better)
            //pol.color = `rgb(${color}, ${color}, ${color})`
            pol.color = new Uint8Array([color, color, color, 255]) // 255 for opacity
        })

        //################### Project the all poligons to the seen #################
        //-------------- projection (Perspective projection) -------------
        polygonsList = polygonsList.map(pol => {

            pol.v1 = this.game.world.projectionMatrix.multiVector(pol.v1);
            pol.v1.x /= pol.v1.w;
            pol.v1.y /= pol.v1.w;
            pol.v1.z /= pol.v1.w;
            
            pol.v2 = this.game.world.projectionMatrix.multiVector(pol.v2);
            pol.v2.x /= pol.v2.w;
            pol.v2.y /= pol.v2.w;
            pol.v2.z /= pol.v2.w;
            
            pol.v3 = this.game.world.projectionMatrix.multiVector(pol.v3);
            pol.v3.x /= pol.v3.w;
            pol.v3.y /= pol.v3.w;
            pol.v3.z /= pol.v3.w;

            if (pol.v4 !== undefined)
            {
                pol.v4 = this.game.world.projectionMatrix.multiVector(pol.v4);
                pol.v4.x /= pol.v4.w;
                pol.v4.y /= pol.v4.w;
                pol.v4.z /= pol.v4.w;
            }

            return pol;
        });

        //console.log('Polygons: ' + polygonsList.length);
        // sort Polygons
        /*polygonsList.sort(function (pol1, pol2) {
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
        });*/

        // render a Polygons
/*        polygonsList.map(pol => {
            if (typeof pol.v4 === 'undefined')
                this.game.render.renderTriangle(this.game.render.screenSpaceTr(pol));
            else
                this.game.render.renderQuadrant(this.game.render.screenSpaceQuad(pol));
        });*/


/*        let pol = new Triangle(new Vector2(50, 183), new Vector2(27, 204), new Vector2(11, 177), Colors.GREEN) 
        polygonsList = [pol]
*/

        //console.log(polygonsList)

        polygonsList.map(pol => {


            // convert from 0 to 1 to screen scall (in pixels)
            pol.v1.x = Math.round(pol.v1.x * width + width*0.5)
            pol.v1.y = Math.round(-pol.v1.y * height + height*0.5)
            //pol.v1.z *= -1 

            pol.v2.x = Math.round(pol.v2.x * width + width*0.5)
            pol.v2.y = Math.round(-pol.v2.y * height + height*0.5)
            //pol.v2.z *= -1

            pol.v3.x = Math.round(pol.v3.x * width + width*0.5)
            pol.v3.y = Math.round(-pol.v3.y * height + height*0.5)
            //pol.v3.z *= -1
            //console.log(pol)

            // calculate the boundary box that wrap the triangle (v1, v2, v3)
            let [Vmin, Vmax] = Math3d.bbox(pol, width, height)
            // clip the bbox by the screen to rediuce Rastoration process.
            let Xmin = Math.max(0, Math.min(width-1, Vmin[0]))
            let Ymin = Math.max(0, Math.min(height-1, Vmin[1]))
            
            let Xmax = Math.max(0, Math.min(width-1, Vmax[0]))
            let Ymax = Math.max(0, Math.min(height-1, Vmax[1]))

            let z = null
            let area = null
            let a = null
            let b = null
            let c = null
            for (let x = Xmin; x <= Xmax; ++x)
            {
                for (let y = Ymin; y <= Ymax; ++y)
                {
                    area = Math3d.Area(pol.v1, pol.v2, pol.v3)  // the total area of the triangle (poligon)
                    a = Math3d.Area2(pol.v2, pol.v3, x, y)      // aria of triangle (v2, v3, p) 
                    b = Math3d.Area2(pol.v3, pol.v1, x, y)      // aria of triangle (v3, v1, p)
                    c = Math3d.Area2(pol.v1, pol.v2, x, y)      // aria of triangle (v1, v2, p)

                    // check x & y of Point P if is inside the 2D triangle.
                    if (a >= 0 && b >= 0 && c >= 0)
                    {
                        // calculate the barycentric coordinates.
                        a /= area
                        b /= area
                        c /= area

                        // calcutate Z coordinate of P using a, b & c  
                        //z = a * pol.v1.z + b * pol.v2.z + c * pol.v3.z
                        z = 1 / (a / pol.v1.z + b / pol.v2.z + c / pol.v3.z)

                        if (z > this.Z_Buffer[x][y])
                        {
                            this.Z_Buffer[x][y] = z // distance from camera to the traingle
                            this.FrameBuffer[x][y] = pol.color
                        }
                        /*if (a.toFixed(2) == 0 || b.toFixed(2) == 0 || c.toFixed(2) == 0)
                        {
                            this.Z_Buffer[x][y] = z
                            this.FrameBuffer[x][y] = Colors.RED
                        }*/
                    }
                }
            }

            //render bbox 
/*            this.game.ctx.fillStyle = Colors.WHITE
            this.game.ctx.strokeStyle = Colors.WHITE
            this.game.ctx.beginPath();
            this.game.ctx.lineWidth = Configs.render.lineWidth;
            this.game.ctx.moveTo(Xmin, Ymin);
            this.game.ctx.lineTo(Xmax, Ymin);
            this.game.ctx.lineTo(Xmax, Ymax);
            this.game.ctx.lineTo(Xmin, Ymax);
            this.game.ctx.lineTo(Xmin, Ymin);
            //this.game.ctx.closePath();
            this.game.ctx.stroke();*/

            // render pol
/*            this.game.ctx.fillStyle = Colors.YELLOW
            this.renderTriangle(pol)*/


        })

        //exit()
        polygonsList = null
    }



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
            v.x * 0.5,
            -v.y * 0.5
        );
        /*
        return new Vector2(
            this.game.canvas.width * v.x * 0.5,
            this.game.canvas.height * -v.y * 0.5
        );*/
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
        //this.game.ctx.clearRect(-this.game.canvas.width / 2, -this.game.canvas.height / 2, this.game.canvas.width, this.game.canvas.height);
        this.game.ctx.fillStyle = this.DEFAULT_FRAMEBUFFER_COLOR
        //this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }


}