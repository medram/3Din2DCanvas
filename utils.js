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
