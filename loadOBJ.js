import { Vector4, Vector3 } from "./math3d.js";
import Configs from "./configs.js";
import * as Math3d from "./math3d.js";

export default class LoadOBJ {
    constructor(filename)
    {
        console.log("Loading OBJ file: " + filename);
        this.filename = filename
        this.data = this.readObjFile(`http://${Configs.server.host}:${Configs.server.port}/inc/Objs/${filename}`);
        this.vertices = [];
        this.faces = [];
        this.normals = [];
        this.textures = [];
        this.fileFound = false;

        this.parse();
        //console.log(this.vertices);
    }

    parse()
    {
        if (this.data == '')
            return false;
        else
            this.fileFound = true;

        let lines = this.data.split('\n');
        let face = null
        lines.forEach(line => {
            if (line.startsWith('v '))
            {
                let arr = line.slice(2).split(' ').map(value => parseFloat(value));
                this.vertices.push(new Vector4(...arr));
                //console.log(this.vertices[0]);
            }
            else if (line.startsWith('vn '))
            {
                let arr = line.slice(3).split(' ').map(value => parseFloat(value));
                this.normals.push(Math3d.normalize(new Vector3(...arr)));
            }
            else if (line.startsWith('vt '))
            {
                let arr = line.slice(3).split(' ').map(value => parseFloat(value));
                this.textures.push(new Vector4(...arr));
            }
            else if (line.startsWith('f '))
            {
                face = {
                    v: [],
                    vt: [],
                    vn: []
                }
                line.slice(2).split(' ').map((part, i) => {
                    part = part.split('/').map(value => parseInt(value))
                    face.v.push(part[0])
                    face.vt.push(part[1])
                    face.vn.push(part[2])
                })
/*                if (this.filename == 'monkey.obj')
                    console.log(face);*/
                this.faces.push(face);
                face = null
            }
        });
/*        if (this.filename == 'monkey.obj')
            console.log(this.faces);*/
    }

    readObjFile(path) {
        let xhr = new XMLHttpRequest();
        let data = '';
        xhr.open("GET", path, false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status == 0) {
                    data = xhr.responseText;
                }
            }
        }
        xhr.send(null);
        return data;
    }
}