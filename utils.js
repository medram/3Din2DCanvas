import Colors from "./colors.js"

export function avgTrZ(tr)
{
    return (tr.v1.z + tr.v2.z + tr.v3.z) / 3;
}

export function avgQuadZ(quad)
{
    return (quad.v1.z + quad.v2.z + quad.v3.z + quad.v4.z) / 4;
}





/* 
export function randX() {
    return Math.random() * canvas.width
}

export function randY() {
    return Math.random() * canvas.height
}

export function rand(max, min) {
    return Math.random() * (max - min) + min
} */

/* export function screenSpace(v) {
    return new Vector2(
        canvas.width * v.x / 2,
        canvas.height * -v.y / 2
    );
} */

/* export function screenSpaceTr(tr) {
    return new Triangle(
        screenSpace(tr.v1),
        screenSpace(tr.v2),
        screenSpace(tr.v3)
    );
    //return tr;
} */

/* export function renderPoint(v) {
    //	console.log(v.x, v.y);
    ctx.lineTo(v.x, v.y);
} */

/* export function renderTraingle(tr) {
    //console.log(tr);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(tr.v1.x, tr.v1.y);
    ctx.lineTo(tr.v2.x, tr.v2.y);
    ctx.lineTo(tr.v3.x, tr.v3.y);
    ctx.lineTo(tr.v1.x, tr.v1.y);
    //ctx.fill();
    ctx.stroke();
}
 */