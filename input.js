import Keyboard from "./keyboard.js";
import Configs from "./configs.js"
import Colors, { nextColor } from "./colors.js";


export default class Input
{
    constructor(game)
    {
        this.game = game;
        this.Keyboard = Keyboard;
//        this.mouse = new Mouse();
        this.keysPressed = [];
        this.keysUp = [];
    }

    update()
    {
        //console.log(this.keysUp);
        if (this.game.input.keyup(Keyboard.KEY_1))
            Configs.render.fill = !Configs.render.fill

        if (this.game.input.keyup(Keyboard.KEY_2))
            Configs.render.clipping = !Configs.render.clipping

        if (this.game.input.keyup(Keyboard.KEY_3))
            Configs.render.fillStyle = nextColor()

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