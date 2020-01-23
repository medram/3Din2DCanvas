import LoadOBJ from './loadOBJ.js'
import Triangle from './triangle.js'
import Vector3, { Quadrant } from './math3d.js'

export default class Mesh {
  constructor (filename) {
    this.filename = filename
    let file = new LoadOBJ(this.filename)
    this.vertices = file.vertices
    this.normals = file.normals
    this.faces = file.faces
    this.triangles = []
    
    this.found = file.fileFound && this.vertices.length > 0;
    
    
  }

  // these are the new vertices
  getPolygons(vertices)
  {
    if (!this.found)
        return [];

    let pols = []
    this.faces.map(face => {
        pols = pols.concat(this.convertFaceToTr(face, vertices))      
    })
    return pols
  }


  convertFaceToTr(face, vertices)
  {
    if (face.v.length === 3)
    {
      let v1 = vertices[face.v[0]-1]
      let v2 = vertices[face.v[1]-1]
      let v3 = vertices[face.v[2]-1]

      return new Triangle(v1, v2, v3, face)
    }
    
    // add Quadratique to Pols
    if (face.v.length === 4)
    {
      let v1 = vertices[face.v[0]-1]
      let v2 = vertices[face.v[1]-1]
      let v3 = vertices[face.v[2]-1]
      let v4 = vertices[face.v[3]-1]

      // the face1 & face2 should be a Deep copy of face
      let face2 = {
        v:  [face.v[0], face.v[2], face.v[3]],
        vt: [face.vt[0], face.vt[2], face.vt[3]],
        vn: [face.vn[0], face.vn[2], face.vn[3]]
      }

      let face1 = {
        v:  [face.v[0], face.v[1], face.v[2]],
        vt: [face.vt[0], face.vt[1], face.vt[1]],
        vn: [face.vn[0], face.vn[1], face.vn[1]]
      }
/*      // This is a Deep Copy.
      let face1 = JSON.parse(JSON.stringify(face))
      // to remove last item (v4)
      face1.v.pop()
      face1.vt.pop()
      face1.vn.pop()*/

      //console.log(new Triangle(v1, v2, v3, face1), new Triangle(v1, v3, v4, face2))
      return [new Triangle(v1, v2, v3, face1), new Triangle(v1, v3, v4, face2)];
    }

  }

/*  convertQuadrantToTriangles(quad)
  {
    let face2 = {
      v:  [quad.face.v[0], quad.face.v[2], quad.face.v[3]],
      vt: [quad.face.vt[0], quad.face.vt[2], quad.face.vt[3]],
      vn: [quad.face.vn[0], quad.face.vn[2], quad.face.vn[3]]
    }

    let face1 = quad.face
    // to remove last item (v4)
    face1.v.pop()
    face1.vt.pop()
    face1.vn.pop()

    return [new Triangle(quad.v1, quad.v2, quad.v3, face1, quad.color), new Triangle(quad.v1, quad.v3, quad.v4, face2, quad.color)];
  }

  convertQuadListToTr(list)
  {
    let result = []
    list.map(quad => {
      result.concat(this.convertQuadrantToTriangles(quad))
    })
    return result
  }*/
}
