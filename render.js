import { Vector2, Vector3, Vector4, Quadrant } from "./math3d.js";
import Triangle from "./triangle.js";
import Configs from "./configs.js";
import * as Math3d from "./math3d.js";
import * as utils from './utils.js';
import Colors from './colors.js'


export default class Render
{
    constructor(game)
    {
        this.game = game;
        this.Z_Buffer = null
        this.FrameBuffer = null
        this.MAX_ZBUFFER_SIZE = 1
        this.MIN_ZBUFFER_SIZE = -1
        this.DEFAULT_FRAMEBUFFER_COLOR = Colors.BLACK
        //this.objects = this.game.world
        this.imgData = null

        this.init_ZBuffer()
        this.init_FrameBuffer()
    }

    // must be initilized with Infinty number
    init_ZBuffer()
    {
        //this.Z_Buffer = new Array(this.game.canvas.width).fill(new Array(this.game.canvas.height).fill(this.MAX_ZBUFFER_SIZE))
        this.Z_Buffer = new Array(this.game.canvas.width * this.game.canvas.height).fill(this.MAX_ZBUFFER_SIZE)
    }

    // must be initilized with black color
    init_FrameBuffer()
    {
        let width = this.game.canvas.width
        let height = this.game.canvas.height

/*        this.FrameBuffer = (new Array(width).fill(0)).map((item) => {
            return new Array(height).fill(this.DEFAULT_FRAMEBUFFER_COLOR)
        })*/
        //this.FrameBuffer = new Array(width * height * 4).fill(0)
        this.FrameBuffer = new Uint8ClampedArray(width * height * 4).fill(0)
    }

    clearBuffers()
    {
        this.clearZBuffer()
        this.clearFrameBuffer()
    }

    clearZBuffer()
    {
        //this.Z_Buffer = this.Z_Buffer.map((xColumn) => xColumn.map((z) => this.MAX_ZBUFFER_SIZE))
        this.Z_Buffer.fill(this.MAX_ZBUFFER_SIZE)
    }

    clearFrameBuffer()
    {
        //this.FrameBuffer = this.FrameBuffer.map((colorsColumn) => colorsColumn.map((color) => this.DEFAULT_FRAMEBUFFER_COLOR))
        this.FrameBuffer.fill(0)
    }

    // Render the FrameBuffer to the Screen
    renderFrameBuffer()
    {

        this.imgData = new ImageData(this.FrameBuffer, this.game.canvas.width, this.game.canvas.height)


        // let options = {
        //     //resizeQuality: "high"
        // }
        /*createImageBitmap(imgData, options).then((imgBitmap) => {
            this.game.ctx.drawImage(imgBitmap, 0, 0, this.game.canvas.width, this.game.canvas.height)
            this.game.ctx.fillText(`FPS: ${this.game.frames.toFixed(0)}`, 10, 15)
        })*/
        this.game.ctx.putImageData(this.imgData, 0, 0)
        this.game.ctx.fillText(`FPS: ${this.game.frames.toFixed(0)}`, 10, 20)
        this.game.ctx.fillText(`Powred By: Mohammed Ramouchy`, 10, this.game.canvas.height - 40)
        this.game.ctx.fillText(`Website: www.ramouchy.com`, 10, this.game.canvas.height - 20)
    }

    renderWorld(objs)
    {
        objs.map(obj => {
            this.renderEntity(obj)
        })
        this.renderFrameBuffer()
        this.clearBuffers()
    }

    ignoreOutsideTriangles(polygonsList) {
        let inversedProjectionMatrix = this.game.world.projectionMatrix.inverse()
        console.log(inversedProjectionMatrix)
        let topPlan = inversedProjectionMatrix.multiVector(new Vector4(0, 1, 0, 1))
        let buttomPlan = inversedProjectionMatrix.multiVector(new Vector4(0, 1, 0, 1))
        let leftPlan = inversedProjectionMatrix.multiVector(new Vector4(-1, 0, 0, 1))
        let rightPlan = inversedProjectionMatrix.multiVector(new Vector4(0, -1, 0, 1))

        return polygonsList.filter(pol => Math3d.isInScene(pol, topPlan, buttomPlan, leftPlan, rightPlan))
    }

    toViewSpace(polygonsList, normalsList)
    {
        //====================== Vertices =========================
        // To camera coordinates (using View Matrix)
        // polygonsList = polygonsList.map(pol => {
        //     return game.world.camera.getViewMatrix().multiVector(v);
        // });

        let viewMatrix = game.world.camera.getViewMatrix()
        let inverseViewMatrix = viewMatrix.reverse().transpose()

        polygonsList.map(pol => {
            pol.v1 = viewMatrix.multiVector(pol.v1)
            pol.v2 = viewMatrix.multiVector(pol.v2)
            pol.v3 = viewMatrix.multiVector(pol.v3)
        })

        // for (let i = 0; i < polygonsList.length; i++)
        // {
        //     polygonsList[i].v1 = viewMatrix.multiVector(polygonsList[i].v1)
        //     polygonsList[i].v2 = viewMatrix.multiVector(polygonsList[i].v2)
        //     polygonsList[i].v3 = viewMatrix.multiVector(polygonsList[i].v3)
        // }

        //====================== Normals ==========================
        // To camera coordinates (using View Matrix)
        // this.newNormals = this.newNormals.map(v => {
        //     return Math3d.normalize(game.world.camera.getViewMatrix().multiVector(v));
        // });
        normalsList.map(v => {
            v = inverseViewMatrix.multiVector(v)
        })
    }

    renderEntity(obj)
    {
        //################ We are in the World space ################
        let polygonsList = obj.getPolygons()
        let normalsList = obj.getNormals()
        let facesList = obj.getFaces()


        //################ Convert obj coordinates to view space (camera) ################
        this.toViewSpace(polygonsList, normalsList)


        //################### obj coordinates are in view space here ####################
        if (Configs.render.clipping) {
            let polyCount = polygonsList.length
            let out = [];

            let w = this.game.canvas.width
            let h = this.game.canvas.height

            let [topNormal, rightNormal, buttomNormal, leftNormal] = this.game.world.camera.getPlanesNormals(w, h)

            // plane positions
            let pos = new Vector3(0, 0, 0)

            //utils.logger.log(t.v3)
            //utils.logger.log(planeNormal)

            polygonsList.map(pol => {
                Math3d.clipTrAgainstPlane(
                    pos,
                    rightNormal, pol, out);
            })

            polygonsList = out;
            out = [];

            polygonsList.map(pol => {
                Math3d.clipTrAgainstPlane(
                    pos,
                    leftNormal, pol, out);
            })

            polygonsList = out;
            out = [];

            polygonsList.map(pol => {
                Math3d.clipTrAgainstPlane(
                    pos,
                    topNormal, pol, out);
            })

            polygonsList = out;
            out = [];

            polygonsList.map(pol => {
                Math3d.clipTrAgainstPlane(
                    pos,
                    buttomNormal, pol, out);
            })

            polygonsList = out;
            out = [];
            //console.log((polyCount - polygonsList.length) / polygonsList.length * 100, '%')
        }
        //################### Ignore outside striangles  ####################

        if (Configs.render.ignoreOutsideTriangles)
        {
            //let count = polygonsList.length
            polygonsList = this.ignoreOutsideTriangles(polygonsList)
            //console.log(count + ' => ' + polygonsList.length)
        }

        //################### Clipping the poligons to rediuce  ####################
        //let newList = [];
        let out = [];
        let planeNormal;
        //-------------- for near plane ---------------
        polygonsList.map(pol => {
            Math3d.clipTrAgainstPlane(new Vector3(0, 0, -this.game.world.camera.near), new Vector3(0, 0, -1), pol, out);
        });

        polygonsList = out;
        out = [];

        //-------------- for far plane ---------------
        polygonsList.map(pol => {
            Math3d.clipTrAgainstPlane(new Vector3(0, 0, -this.game.world.camera.far), new Vector3(0, 0, 1), pol, out);
        });

        polygonsList = out;
        out = [];

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
            perp = normalsList[pol.face.vn[0]-1]

            if (Configs.render.fakeNormals && perp === undefined)
                perp = Math3d.normalize(pol.v1.cross(pol.v2))
            if (perp !== undefined)
            {
                contrast = (perp.dot(lightSource)+1)*0.5
                //color = (contrast*220+20).toFixed(0) // the color range should be 0~255 (but 20~240 is better)
                // the color range should be 0~255 (but 20~240 is better)
                pol.color = utils.convertColor(contrast, pol.color) // 255 for opacity
                //pol.color = new Uint8Array([color, color, color, 255]) // 255 for opacity
            }
        })

        //################### Project the all poligons to the seen #################
        //projection (Perspective projection) to Normalized Device Coordinates(NDC)(-1 to 1 in all 3 axes)
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

        //############### Where are in DNC coordinates ###############

        // Convert DNC coordinates to 2D space (Viewport space/screen)
        polygonsList.map(pol => {

            // convert from 0 to 1 to screen scall (in pixels)
            pol.v1.x = Math.round(width * (pol.v1.x + 1) * 0.5)
            pol.v1.y = Math.round(height * (-pol.v1.y + 1) * 0.5)
            //pol.v1.z *= -1

            pol.v2.x = Math.round(width * (pol.v2.x + 1) * 0.5)
            pol.v2.y = Math.round(height * (-pol.v2.y + 1) * 0.5)

            pol.v3.x = Math.round(width * (pol.v3.x + 1) * 0.5)
            pol.v3.y = Math.round(height * (-pol.v3.y + 1) * 0.5)

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
            let index = 0

            if (Configs.render.fill)
            {
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
                            z = a * pol.v1.z + b * pol.v2.z + c * pol.v3.z
                            //z = 1 / (a / pol.v1.z + b / pol.v2.z + c / pol.v3.z)

                            // pixel position
                            index = (y * width + x)

                            //utils.logger.log(this.Z_Buffer[index])
                            if (z < this.Z_Buffer[index])
                            {
                                //this.Z_Buffer[x][y] = z // distance from camera to the traingle
                                //this.FrameBuffer[x][y] = pol.color
                                this.Z_Buffer[index] = z

                                let [R, G, B, A] = pol.color
                                this.FrameBuffer[index * 4 + 0] = R
                                this.FrameBuffer[index * 4 + 1] = G
                                this.FrameBuffer[index * 4 + 2] = B
                                this.FrameBuffer[index * 4 + 3] = A
                            }
                        }
                    }
                } // end loop
            }

            if (Configs.render.drawLines)
            {
                // x & y are in pixels scale
                Math3d.drawLine(pol.v1, pol.v2, pol.v3, width, height, this.FrameBuffer, this.Z_Buffer)
                Math3d.drawLine(pol.v2, pol.v3, pol.v1, width, height, this.FrameBuffer, this.Z_Buffer)
                Math3d.drawLine(pol.v3, pol.v1, pol.v2, width, height, this.FrameBuffer, this.Z_Buffer)
            }
        })

        polygonsList = null
    }

/*    renderPoint(v)
    {
        this.game.ctx.lineTo(v.x, v.y);
    }*/

    clear()
    {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        //this.game.ctx.fillStyle = this.DEFAULT_FRAMEBUFFER_COLOR
        //this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }


}
