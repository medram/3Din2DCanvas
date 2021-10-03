import Colors from "./colors.js"

// contrast is between 0 & 1
export function convertColor(contrast, color)
{
    //console.log(color)

    let R = (contrast*color[0]).toFixed(0) // the color range should be 0~255 (but 20~240 is better)
    let G = (contrast*color[1]).toFixed(0) // the color range should be 0~255 (but 20~240 is better)
    let B = (contrast*color[2]).toFixed(0)
    return new Uint8Array([R, G, B, 255])
}

class Logger
{
    constructor(fps)
    {
        this.time = new Date().getTime()
        this.fps = fps
        this.delta = 1000 / this.fps
    }

    log(str)
    {
        if (new Date().getTime() - this.time > this.delta)
        {
            console.log(str)
            this.time = new Date().getTime()
        }
    }
}

export const logger = new Logger(16)
