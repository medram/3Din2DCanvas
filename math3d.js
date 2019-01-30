import Triangle from "./triangle.js";

export default class Vector4 {
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
    [1 / (Math.tan(fov * 0.5) * wh), 0, 0, 0],
    [0, 1 / Math.tan(fov * 0.5), 0, 0],
    [0, 0, far / (far - near), 1],
    [0, 0, near * far / (near - far), 0]
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

/*   return new Matrix4([
    [L.x, U.x, F.x, 0],
    [L.y, U.y, F.y, 0],
    [L.z, U.z, F.z, 0],
    [T.x, T.y, T.z, 1]
  ]); */
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

export function degrees (angle) {
  return radien * 180 / Math.PI
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
  constructor(v1, v2, v3, v4)
  {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.v4 = v4;
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
  let N = normalize(point);
  return planeNormal.x * point.x + planeNormal.y * point.y + planeNormal.z * point.z - planeNormal.dot(planePos);
}

export function clipAgainstPlane(planePos, planeNormal, pol, out)
{
  // check if polygon is a Triangle or Quadrant
  if (pol.v4 !== undefined) {
    return clipQuadAgainstPlane(planePos, planeNormal, pol, out);
  }

  return clipTrAgainstPlane(planePos, planeNormal, pol, out);
}

export function clipQuadAgainstPlane(planePos, planeNormal, quad, out)
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
}

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
    out.push(new Triangle(
      insidePoints[0],
        intersectPlane(planePos, planeNormal, insidePoints[0], outsidePoints[0]),
        intersectPlane(planePos, planeNormal, insidePoints[0], outsidePoints[1]))
      );
    return 1;
  }

  if (insidePoints.length == 2 && outsidePoints.length == 1)
  {
    let tr1 = new Triangle(insidePoints[0], insidePoints[1], intersectPlane(planePos, planeNormal, insidePoints[0], outsidePoints[0]));
    out.push(tr1);
    out.push(new Triangle(insidePoints[1], tr1.v3, intersectPlane(planePos, planeNormal, insidePoints[1], outsidePoints[0])));

    return 2;
  }
}

export function convertQuadrantToTriangles(quad)
{
  return [new Triangle(quad.v1, quad.v2, quad.v3), new Triangle(quad.v1, quad.v3, quad.v4)];
}