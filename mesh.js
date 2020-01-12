import LoadOBJ from './loadOBJ.js'
import Triangle from './triangle.js'
import Vector3, { Quadrant } from './math3d.js'

export default class Mesh {
  constructor (filename) {
    let file = new LoadOBJ(filename)
    this.vertices = file.vertices
    this.normals = file.normals
    this.faces = file.faces
    this.triangles = []
    
    this.found = file.fileFound && this.vertices.length > 0;
  
    /*
  this.vertices = [
      new Vector3(-1, 1, 0),
      new Vector3(1, 1, 0),
      new Vector3(1, -1, 0),
      new Vector3(-1, -1, 0)
  ]
  
  this.faces = [
      ["1/0/0", "2/0/0", "3/0/0"],
      ["1/0/0", "3/0/0", "4/0/0"]
  ]
  */
  }

  getPolygons(vertices)
  {
    if (!this.found)
        return [];

    if (this.faces[0] && this.faces[0].v.length === 3)
      return this.getTriangles(vertices)
    else
    {
      //return this.convertQuadListToTr(this.getQuadrant(vertices))
      return this.getQuadrant(vertices)
    }
  }

  // list of the vertices
  getTriangles (vertices) {
/*    if (this.faces[0].v.length !== 3)
      return []*/

    return this.faces.map(face => {
      let v = face.v.map(value => {
        return vertices[value - 1]
      })
      return new Triangle(v[0], v[1], v[2], face)
    })
  }

  getQuadrant (vertices) {
/*    if (this.faces[0].length !== 4)
      return [];*/

    return this.faces.map(face => {
      let v = face.v.map(value => {
        return vertices[value - 1]
      })
      return new Quadrant(v[0], v[1], v[2], v[3], face)
    })
  }

  convertQuadrantToTriangles(quad)
  {
    return [new Triangle(quad.v1, quad.v2, quad.v3, quad.face, quad.color), new Triangle(quad.v1, quad.v3, quad.v4, quad.face, quad.color)];
  }

  convertQuadListToTr(list)
  {
    return list.map(quad => {
      return newList.concat(this.convertQuadrantToTriangles(quad));
    });
  }
}
