export class Repere {
    constructor(i, j)
    {
        this.init(i, j);
    }

    init(i, j)
    {
        
    }

    draw()
    {
        let l = [
            new Vector3(0, 0, 0),
            new Vector3(10, 0, 0),
            new Vector3(0, 10, 0),
            new Vector3(10, 0, 10)
        ];
        let l2 = [];
        //Math3d.viewSpace(camera, l).forEach(v => {
        l.forEach(v => {
            l2.push(util.screenSpace(v));
        });

        l2 = Math3d.simpleProjection(l2);

        ctx.beginPath();
        ctx.strokeStyle = '#DA4453';
        ctx.lineWidth = 2;
        ctx.moveTo(l2[0].x, l2[0].y, l2[0].z);
        ctx.lineTo(l2[1].x, l2[1].y, l2[1].z);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#8CC152';
        ctx.lineWidth = 2;
        ctx.moveTo(l2[0].x, l2[0].y, l2[0].z);
        ctx.lineTo(l2[2].x, l2[2].y, l2[2].z);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#4A89DC';
        ctx.moveTo(l2[0].x, l2[0].y, l2[0].z);
        ctx.lineTo(l2[3].x, l2[3].y, l2[3].z);
        ctx.stroke();
    }

}