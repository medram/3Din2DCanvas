import Triangle from "./triangle.js"
import Colors from './colors.js'
import Configs from './configs.js'

export default null

export function bbox(pol, width, height) // pol is Traingle here
{
  let Xmin = width  // set to the max value
  let Ymin = height // set to the max value
  let Xmax = 0
  let Ymax = 0

  let v = [pol.v1, pol.v2, pol.v3]

  // convert from 0 to 1 to screen scall (in pixels)
/*  v.map(v => {
    // v means vertex
    v.x = Math.round(v.x * width)
    v.y = Math.round(-v.y * height)
  })*/

  for (let i = 0; i < 3; ++i)
  {
    if (v[i].x < Xmin)
      Xmin = v[i].x

    if (v[i].y < Ymin)
      Ymin = v[i].y

    if (v[i].x > Xmax)
      Xmax = v[i].x

    if (v[i].y > Ymax)
      Ymax = v[i].y
  }

  return [
    [Xmin, Ymin], 
    [Xmax, Ymax]
  ] 
}


export function pixelContainedIn2DTraingle(v1, v2, v3, x, y, z)
{
  if (Math.random() > 0.5)
    return true
  else 
    return false
}


/*
v1 & v2 are tow vertices
x & y is P is a point coordinat
*/
export function edgeFunction(a, b, x, y)
{
  return (x - a.x) * (b.y - a.y) - (y - a.y) * (b.x - a.x) >= 0
}

/*
v1 & v2 are tow vertices
p is a point
*/
export function Area(a, b, p)
{
  return (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x)
}

export function Area2(a, b, x, y)
{
  return (x - a.x) * (b.y - a.y) - (y - a.y) * (b.x - a.x)
}

export function isPointInsideTriangle(v0, v1, v2, x, y)
{
  return edgeFunction(v0, v1, x, y) && edgeFunction(v1, v2, x, y) && edgeFunction(v2, v0, x, y)
}

// drow just line from v1 to v2
export function drawLine(v1, v2, v3, width, height, FrameBuffer, Z_Buffer)
{
  let m = (v2.y - v1.y) / (v2.x - v1.x)

  //let xmin = Math.min(v1.x, v2.x).toFixed(0)
  //let xmax = Math.max(v1.x, v2.x).toFixed(0)
  let xmin = Math.max(0, Math.min(v1.x, v2.x))
  let xmax = Math.min(width-1, Math.max(v1.x, v2.x))

/*  let ymin = Math.max(0, Math.min(height-1, Math.min(v1.y, v2.y)))
  let ymax = Math.max(0, Math.min(height-1, Math.max(v1.y, v2.y)))*/

  let area = null
  let a = null
  let b = null 
  let c = null
  
  let z = null

  let oldx = xmin
  let tmp_yi1 = null
  let tmp_yi = null
  let yi1 = null
  let yi = null
  
  for (let x = xmin; x <= xmax; x++)
  {
      // if the line is orisontal (that will acure and infinit loop)
      if (Math.abs(m) === Infinity)
      {
        yi1 = Math.max(v1.y, v2.y)
        yi = Math.min(v1.y, v2.y)
      }
      else
      {
        tmp_yi1 = Math.round((m * (x - v1.x) + v1.y))
        tmp_yi = Math.round((m * (oldx - v1.x) + v1.y))
        yi1 = Math.max(tmp_yi1, tmp_yi)
        yi = Math.min(tmp_yi1, tmp_yi)
      }

      for (let y = yi; y <= yi1; y++)
      {
          area = Area(v1, v2, v3)  // the total area of the triangle (gon)
          a = Area2(v2, v3, x, y)      // aria of triangle (v2, v3, p) 
          b = Area2(v3, v1, x, y)      // aria of triangle (v3, v1, p)
          c = Area2(v1, v2, x, y)      // aria of triangle (v1, v2, p)
          
          a /= area
          b /= area
          c /= area
          
          z = a * v1.z + b * v2.z + c * v3.z
          if (z >= Z_Buffer[x][y])
          {
              Z_Buffer[x][y] = z // distance from camera to the traingle
              FrameBuffer[x][y] = Configs.render.strokeStyle
          }
      }
      oldx = x
  }
}



export function perpendicularOnTr(tr)
{
  return normalize(tr.v1.cross(tr.v2))
}



export class Vector4 {
  constructor (x = 0 , y = 0 , z = 0 , w = 1) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
    this.w = parseFloat(w);
  }

  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  cross (v) {
    return new Vector4(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
      this.w
    )
  }

  add (v) {
    return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w)
  }

  sub (v) {
    return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w)
  }

  multi(num) {
    return new Vector4(
      this.x * num,
      this.y * num,
      this.z * num,
      this.w
    );
  }
}

export class Vector3 {
  constructor (x = 0 , y = 0 , z = 0) {
    //console.log(x, y, z);
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
  }

  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross (v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

  add (v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  sub (v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  multi (num) {
    return new Vector3(
      this.x * num,
      this.y * num,
      this.z * num
    );
  }
}

export class Vector2 {
  constructor (x = 0 , y = 0) {
    this.x = parseFloat(x)
    this.y = parseFloat(y)
  }

  dot (v) {
    return this.x * v.x + this.y * v.y
  }

  add (v) {
    return new Vector2(this.x + v.x, this.y + v.y)
  }

  sub (v) {
    return new Vector2(this.x - v.x, this.y - v.y)
  }

  multi(num) {
    return new Vector2(
      this.x * num,
      this.y * num
    );
  }
}

export function scale(matrix, scaleNumber) {
  //return new Vector4(scaleVector.x * v.x, scaleVector.y * v.y, scaleVector.z * v.z, 1)
  return new Matrix4([
      [scaleNumber, 0, 0, 0],
      [0, scaleNumber, 0, 0],
      [0, 0, scaleNumber, 0],
      [0, 0,  0,  1]
  ]).multi(matrix);
}

export function translate(matrix, transVector) {
  //return new Vector4(transVector + v.x, transVector.y + v.y, transVector.z + v.z, 1)
    return new Matrix4([
        [1, 0, 0, transVector.x],
        [0, 1, 0, transVector.y],
        [0, 0, 1, transVector.z],
        [0, 0, 0, 1]
    ]).multi(matrix);
}

export function rotate(matrix, angle, axe)
{
  // to radians
  //angle = angle * Math.PI / 180;
  // rotation on X, Y & Z
  return new Matrix4([
    [Math.cos(angle) + axe.x * axe.x * (1 - Math.cos(angle)), axe.x * axe.y * (1 - Math.cos(angle)) - axe.z * Math.sin(angle), axe.x * axe.z * (1 - Math.cos(angle)) + axe.y * Math.sin(angle), 0],
    [axe.x * axe.y * (1 - Math.cos(angle)) + axe.z * Math.sin(angle), Math.cos(angle) + axe.y * axe.y * (1 - Math.cos(angle)), axe.y * axe.z * (1 - Math.cos(angle)) - axe.x * Math.sin(angle), 0],
    [axe.z * axe.x * (1 - Math.cos(angle)) - axe.y * Math.sin(angle), axe.y * axe.z * (1 - Math.cos(angle)) + axe.x * Math.sin(angle), Math.cos(angle) + axe.z * axe.z * (1 - Math.cos(angle)), 0],
    [0, 0, 0, 1],
  ]).multi(matrix);
}

export function rotateX(v, angle) {
  let tmp = Math.cos(angle) * v.y - Math.sin(angle) * v.z;
  v.z = Math.sin(angle) * v.y + Math.cos(angle) * v.z;
  v.y = tmp;
  /*   return new Vector3(
    v.x,
    Math.cos(angle) * v.y - Math.sin(angle) * v.z,
    Math.sin(angle) * v.y + Math.cos(angle) * v.z
  ); */
}

export function rotateY(v, angle) {
  //console.log(v);
  let tmp = Math.cos(angle) * v.x + Math.sin(angle) * v.z;
  v.z = -Math.sin(angle) * v.x + Math.cos(angle) * v.z;
  v.x = tmp;
  /*return new Vector3(
    Math.cos(angle) * v.x + Math.sin(angle) * v.z,
    v.y,
    -Math.sin(angle) * v.x + Math.cos(angle) * v.z
  );
  */
}

export function rotateZ(v, angle) {
  let tmp = Math.cos(angle) * v.x - Math.sin(angle) * v.y;
  v.y = Math.sin(angle) * v.x + Math.cos(angle) * v.y;
  v.x = tmp;
  
  /*   return new Vector3(
    Math.cos(angle) * v.x - Math.sin(angle) * v.y,
    Math.sin(angle) * v.x + Math.cos(angle) * v.y
  ); */
}

/*
    FOV, width, height, far, near, vector
    hw float: means width / height
*/

export function perspective(fov, wh, near, far, v) {
  /* return new Vector3(
    v.x / (Math.tan(radians(fov) / 2) * wh),
    v.y / Math.tan(radians(fov) / 2),
    far / (far - near) * v.z + 1
  ); */
  return new Matrix4([
    [1 / (Math.tan(fov * 0.5) * wh),  0,                          0,                          0],
    [0,                               1 / Math.tan(fov * 0.5),    0,                          0],
    [0,                               0,                          far / (far - near),         1],
    [0,                               0,                          near * far / (near - far),  0]
  ]);
}

export function createLookAt(eye, target, up) {
  let F = normalize(eye.sub(target));
  let R = normalize(up.cross(F));
  let U = F.cross(R);
  let T = new Vector3();
  T.x = -R.dot(eye);
  T.y = -U.dot(eye);
  T.z = -F.dot(eye);

  return new Matrix4([
      [R.x, R.y, R.z, T.x],
      [U.x, U.y, U.z, T.y],
      [F.x, F.y, F.z, T.z],
      [0,     0,   0,   1]
    ]);
}

export function normalize (v) {
  let normal = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return new Vector4(v.x / normal, v.y / normal, v.z / normal, 0);
}

export function mat4(num)
{
  return new Matrix4([
    [num, 0, 0, 0],
    [0, num, 0, 0],
    [0, 0, num, 0],
    [0, 0, 0, num]
  ]);
}

export class Matrix4 {
  constructor (m) {
    this.m = m
  }

  add (m) {
    return new Matrix4([
      [this.m[0][0] + m.m[0][0], this.m[0][1] + m.m[0][1], this.m[0][2] + m.m[0][2], this.m[0][3] + m.m[0][3]],
      [this.m[1][0] + m.m[1][0], this.m[1][1] + m.m[1][1], this.m[1][2] + m.m[1][2], this.m[1][3] + m.m[1][3]],
      [this.m[2][0] + m.m[2][0], this.m[2][1] + m.m[2][1], this.m[2][2] + m.m[2][2], this.m[2][3] + m.m[2][3]],
      [this.m[3][0] + m.m[3][0], this.m[3][1] + m.m[3][1], this.m[3][2] + m.m[3][2], this.m[3][3] + m.m[3][3]]
    ])
  }

  sub (m) {
    return new Matrix4([
      [this.m[0][0] - m.m[0][0], this.m[0][1] - m.m[0][1], this.m[0][2] - m.m[0][2], this.m[0][3] - m.m[0][3]],
      [this.m[1][0] - m.m[1][0], this.m[1][1] - m.m[1][1], this.m[1][2] - m.m[1][2], this.m[1][3] - m.m[1][3]],
      [this.m[2][0] - m.m[2][0], this.m[2][1] - m.m[2][1], this.m[2][2] - m.m[2][2], this.m[2][3] - m.m[2][3]],
      [this.m[3][0] - m.m[3][0], this.m[3][1] - m.m[3][1], this.m[3][2] - m.m[3][2], this.m[3][3] - m.m[3][3]]
    ])
  }

  multiVector(v) {
    return new Vector4(
      this.m[0][0] * v.x + this.m[0][1] * v.y + this.m[0][2] * v.z + this.m[0][3] * v.w,
      this.m[1][0] * v.x + this.m[1][1] * v.y + this.m[1][2] * v.z + this.m[1][3] * v.w,
      this.m[2][0] * v.x + this.m[2][1] * v.y + this.m[2][2] * v.z + this.m[2][3] * v.w,
      this.m[3][0] * v.x + this.m[3][1] * v.y + this.m[3][2] * v.z + this.m[3][3] * v.w 
    );
  }

  multi(m)
  {
    let arr = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (let r = 0; r < 4; ++r)
    {
      for (let c = 0; c < 4; ++c)
      {
        //arr[r][c] = 0;
        for (let i = 0; i < 4; ++i)
        {
          arr[r][c] += this.m[r][i] * m.m[i][c];
        }
      }
    }

    return new Matrix4(arr);
  }

  reverse()
  {
    return new Matrix4([
      [this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0]],
      [this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1]],
      [this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2]],
      [this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]]
    ]);
  }
}

export function radians (angle) {
  return angle * Math.PI / 180
}

export function degrees (radians) {
  return radians * 180 / Math.PI
}

export function worldSpace (center, listOfVectors4) {
  let newListOfVectors4 = [];
  listOfVectors4.forEach(v => {
    newListOfVectors4.push(center.add(v));
  })
  return newListOfVectors4;
}

export function viewSpace (camera, list) {
    let newList = [];
    list.forEach(v => {
        newList.push(camera.m.multi(v));
    });
    return newList;
}

/* export function simpleProjection(list)
{
	let newList = [];
	list.forEach(v => {
		newList.push(new Vector3(
			v.x / v.z,
			v.y / v.z
		));
	});
	return newList;
} */


export class Quadrant
{
  constructor(v1, v2, v3, v4, face = [], color = Colors.WHITE)
  {
    this.v1 = v1
    this.v2 = v2
    this.v3 = v3
    this.v4 = v4
    this.face = face
    this.color = color
  }
}

export function intersectPlane(planePos, planeNormal, startP, endP)
{
  planeNormal = normalize(planeNormal);
  let plane_d = -planeNormal.dot(planePos);
  let ad = startP.dot(planeNormal);
  let bd = endP.dot(planeNormal);
  let t = (-plane_d - ad) / (bd - ad);
  let lineStartToEnd = endP.sub(startP);
  let lineToIntersect = lineStartToEnd.multi(t);
  return startP.add(lineToIntersect);
}

export function dist(planePos, planeNormal, point)
{
  //let N = normalize(point);
  return (planeNormal.x * point.x + planeNormal.y * point.y + planeNormal.z * point.z) - planeNormal.dot(planePos);
  //return planeNormal.dot(point.sub(planePos))
}

export function clipAgainstPlane(planePos, planeNormal, pol, out)
{
  // check if polygon is a Triangle or Quadrant
  /*if (pol.v4 !== undefined)
    return clipQuadAgainstPlane(planePos, planeNormal, pol, out);*/

  return clipTrAgainstPlane(planePos, planeNormal, pol, out);
}

/*export function clipQuadAgainstPlane(planePos, planeNormal, quad, out)
{
  planeNormal = normalize(planeNormal);
  let insidePoints = [];
  let outsidePoints = [];

  let d0 = dist(planePos, planeNormal, quad.v1);
  let d1 = dist(planePos, planeNormal, quad.v2);
  let d2 = dist(planePos, planeNormal, quad.v3);
  let d3 = dist(planePos, planeNormal, quad.v4);

  if (d0 >= 0)
    insidePoints.push(quad.v1);
  else
    outsidePoints.push(quad.v1);

  if (d1 >= 0)
    insidePoints.push(quad.v2);
  else
    outsidePoints.push(quad.v2);

  if (d2 >= 0)
    insidePoints.push(quad.v3);
  else
    outsidePoints.push(quad.v3);

  if (d3 >= 0)
    insidePoints.push(quad.v4);
  else
    outsidePoints.push(quad.v4);

  if (insidePoints.length == 4)
  {
    out.push(quad);
    return 1;
  }
  else
  {
    let list = convertQuadrantToTriangles(quad);
    clipTrAgainstPlane(planePos, planeNormal, list[0], out);
    clipTrAgainstPlane(planePos, planeNormal, list[1], out);
  }
}*/

export function clipTrAgainstPlane(planePos, planeNormal, tr, out)
{
  planeNormal = normalize(planeNormal);
  let insidePoints = [];
  let outsidePoints = [];

  let d0 = dist(planePos, planeNormal, tr.v1);
  let d1 = dist(planePos, planeNormal, tr.v2);
  let d2 = dist(planePos, planeNormal, tr.v3);

  if (d0 >= 0)
    insidePoints.push(tr.v1);
  else
    outsidePoints.push(tr.v1);

  if (d1 >= 0)
    insidePoints.push(tr.v2);
  else
    outsidePoints.push(tr.v2);

  if (d2 >= 0)
    insidePoints.push(tr.v3);
  else
    outsidePoints.push(tr.v3);

  if (insidePoints.length == 0)
  {
    // do nothing
    return 0;
  }

  if (insidePoints.length == 3)
  {
    out.push(tr);
    return 1;
  }
  
  if (insidePoints.length == 1 && outsidePoints.length == 2)
  {
    //tr.color = Colors.RED
    out.push(new Triangle(
      insidePoints[0],
        intersectPlane(planePos, planeNormal, insidePoints[0], outsidePoints[1]),
        intersectPlane(planePos, planeNormal, insidePoints[0], outsidePoints[0]),
        tr.face,
        tr.color
      ));
    return 1;
  }

  if (insidePoints.length == 2 && outsidePoints.length == 1)
  {
    //tr.color = Colors.GREEN
    let tr1 = new Triangle(insidePoints[0], insidePoints[1], intersectPlane(planePos, planeNormal, insidePoints[0], outsidePoints[0]), tr.face, tr.color);
    out.push(tr1);
    //tr.color = Colors.ORANGE
    out.push(new Triangle(tr1.v3, insidePoints[1], intersectPlane(planePos, planeNormal, insidePoints[1], outsidePoints[0]), tr.face, tr.color));

    return 2;
  }
}

export function convertQuadrantToTriangles(quad)
{
  //console.log('convertQuadrantToTriangles')
  //quad.color = Colors.PURPLE
  return [new Triangle(quad.v1, quad.v2, quad.v3, quad.face, quad.color), new Triangle(quad.v3, quad.v4, quad.v1, quad.face, quad.color)];
}