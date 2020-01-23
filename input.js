import Keyboard from "./keyboard.js";
import Configs from "./configs.js"
import Colors, { nextColor } from "./colors.js";


export default class Input
{
    constructor()
    {
        this.Keyboard = Keyboard;
        this.keysPressed = [];
        this.keysUp = [];
    }

    update(game)
    {
        //console.log(this.keysUp);
        if (this.keyup(Keyboard.KEY_1))
        {
            Configs.render.fill = !Configs.render.fill
            console.log('Note: Fill traingles: ', Configs.render.fill)
        }

        if (this.keyup(Keyboard.KEY_2))
        {
            Configs.render.clipping = !Configs.render.clipping
            console.log('Note: Clipping Mode: ', Configs.render.clipping)
        }

        if (this.keyup(Keyboard.KEY_3))
        {
            Configs.render.fakeNormals = !Configs.render.fakeNormals
            console.log('Note: FakeNormals Mode: ', Configs.render.fakeNormals)
        }

        // clear Up keys (important)
        this.keysUp = []
    }

    keypress(keyCode)
    {
        //console.log(keyCode)
        return this.keysPressed.includes(keyCode);
    }

    keyup(keyCode)
    {
        //console.log(keyCode)
        return this.keysUp.includes(keyCode);
    }

    capturePressKeys(e)
    {
        e.preventDefault();
        let keyCode = e.which || e.keyCode;
        if (!this.keysPressed.includes(keyCode))
            this.keysPressed.push(keyCode);
    }

    capturnDownKeys(e)
    {
        let keyCode = e.which || e.keyCode;
        if (!this.keysPressed.includes(keyCode))
            this.keysPressed.push(keyCode);
    }

    capturnUpKeys(e)
    {
        let keyCode = e.which || e.keyCode;
        if (this.keysPressed.includes(keyCode))
        {
            // remove the key here
            this.keysPressed.splice(this.keysPressed.indexOf(keyCode), 1);
            this.keysUp.push(keyCode)
        }
    }

    clear()
    {
        // we dont need to clear keysPressed (capturnUpKeys handles this for us)
        //this.keysPressed = [];
    }
}