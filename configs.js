import Colors from "./colors.js"
import { HexColors } from "./colors.js"

let Configs = {
    render: {
        fill: true,
        drawLines: true,
        fillStyle: Colors.GREEN,
        strokeStyle: Colors.BLACK,
        fakeNormals: true,
        clipping: false,
        culling: true, // ignoreOutsideTriangles (outside view space)
    },
    canvas: {
        fillStyle: HexColors.GREEN,
        strokeStyle: HexColors.BLACK,
        font: '14px Arial',
        lineWidth: 1
    },
    server: {
        host: 'localhost',
        port: 5500,
    }
};

export default Configs;
