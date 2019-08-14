import Keyboard from "./keyboard.js";
//import Mouse from "./mouse.js";

export default class Input
{
    constructor(game)
    {
        this.game = game;
        this.Keyboard = Keyboard;
//        this.mouse = new Mouse();
        this.keysPressed = [];
    }

    update()
    {
        //console.log(this.keysPressed);
    }

    keypress(keyCode)
    {
        //console.log(keyCode)
        return this.keysPressed.includes(keyCode);
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
        }
    }

    clear()
    {
        // we dont need to clear keysPressed (capturnUpKeys handles this for us)
        //this.keysPressed = [];
    }
}