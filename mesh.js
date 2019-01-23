import LoadOBJ from './loadOBJ.js'
import Triangle from './triangle.js'
import Vector3, { Quadrant } from './math3d.js'

export default class Mesh {
  constructor (filename) {
    let file = new LoadOBJ(filename)
    this.vertices = file.vertices
    this.normales = file.normales
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

  getPolygons(list)
  {
    if (!this.found)
        return [];

    if (this.faces[0] && this.faces[0].length === 3)
      return this.getTriangles(list)
    else
      return this.getQuadrant(list)
  }

  // list of the vertices
  getTriangles (list) {
    if (this.faces[0].length !== 3)
      return []

    let newList = []
    this.faces.forEach(face => {
      let v = []
      face.forEach(item => {
        // console.log(this)
        item = item.split('/')
        //v.push(this.vertices[item[0] - 1])
        v.push(list[item[0] - 1])
        //console.log(list[item[0] - 1])
      })
      // console.log(v)
      newList.push(new Triangle(v[0], v[1], v[2]))
    })
    //console.log(newList)
    return newList
  }

  getQuadrant (list) {
    if (this.faces[0].length !== 4)
      return [];

    let newList = []
    this.faces.forEach(face => {
      let v = []
      face.forEach(item => {
        // console.log(this)
        item = item.split('/')
        // v.push(this.vertices[item[0] - 1])
        v.push(list[item[0] - 1])
      // console.log(this.vertices[item[0] - 1])
      })
      // console.log(v)
      newList.push(new Quadrant(v[0], v[1], v[2], v[3]))
    })
    // console.log(this.vertices)
    return newList
  }
}
