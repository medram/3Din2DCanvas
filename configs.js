import Colors from "./colors.js"

let Configs = {
    render: {
        fill: true,
        drawLines: true,
        lineWidth: 1,
        fillStyle: Colors.GREEN,
        strokeStyle: Colors.WHITE,
        font: '14px Arial',
        clipping: false,
        fakeNormals: false
    },
    server: {
        host: 'localhost',
        port: 5500,
    }
};

export default Configs;