import Colors from "./colors.js"
import { HexColors } from "./colors.js"

let Configs = {
    render: {
        fill: true,
        drawLines: false,
        fillStyle: Colors.GREEN,
        strokeStyle: Colors.WHITE,
        clipping: false,
        fakeNormals: true
    },
    canvas: {
        fillStyle: HexColors.GREEN,
        strokeStyle: HexColors.WHITE,
        font: '14px Arial',
        lineWidth: 1
    },
    server: {
        host: 'localhost',
        port: 5500,
    }
};

export default Configs;