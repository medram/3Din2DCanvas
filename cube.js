import Entity from './entity.js'

export default class Cube extends Entity
{
    constructor(objFileName, pos = false)
    {
        super(objFileName, pos);
    }

    update(game)
    {
        //console.log(game.timestamp);
        //this.angleY = Math3d.radians(30 * game.timestamp);
        
        //Math3d.rotate(, 30,'X');
        //this.rotate(Math3d.rotateY);
        //this.rotate(Math3d.rotateZ);
    }
}