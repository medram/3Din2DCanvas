import Vector4 from "./math3d.js";

export default class LoadOBJ {
    constructor(filename)
    {
        console.log("Loading OBJ file: " + filename);
        this.data = this.readObjFile("http://127.0.0.1:5500/inc/Objs/" + filename);
        this.vertices = [];
        this.faces = [];
        this.normales = [];
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
        lines.forEach(line => {
            if (line.startsWith('v '))
            {
                let arr = line.slice(2).split(' ');
                this.vertices.push(new Vector4(arr[0], arr[1], arr[2]));
                //console.log(this.vertices[0]);
            }
            else if (line.startsWith('vn '))
            {
                let arr = line.slice(3).split(' ');
                this.normales.push(new Vector4(arr[0], arr[1], arr[2]));
            }
            else if (line.startsWith('vt '))
            {
                let arr = line.slice(3).split(' ');
                this.textures.push(new Vector4(arr[0], arr[1]));
            }
            else if (line.startsWith('f '))
            {
                this.faces.push(line.slice(2).split(' '));
            }
        });
        //console.log(this.faces);
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