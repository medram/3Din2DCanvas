const Colors = {
	RED: 	new Uint8Array([236, 64, 122, 255]),
	GREEN: 	new Uint8Array([139, 195, 74, 255]),
	BLUE: 	new Uint8Array([0, 176, 255, 255]),
	PURPLE: new Uint8Array([171, 71, 188, 255]),
	YELLOW: new Uint8Array([255, 214, 0, 255]),
	ORANGE: new Uint8Array([249, 168, 37, 255]),
	BLACK: 	new Uint8Array([0, 0, 0, 255]),
	WHITE: 	new Uint8Array([255, 255, 255, 255])
};


// color generator
function *colorGenerator()
{
    let keys = Object.keys(HexColors)
    
    for (let i = 0; i < keys.length; i++)
    {
        yield HexColors[keys[i]]
        
        if (i+1 == keys.length)
            i = 0
    }
}

let nxtcolor = colorGenerator()

export const nextColor = () => {
	return nxtcolor.next().value
}

export const HexColors = {
	RED: 	'#EC407A',
	GREEN: 	'#8BC34A',
	BLUE: 	'#00B0FF',
	PURPLE: '#AB47BC',
	YELLOW: '#FFD600',
	ORANGE: '#F9A825',
	BLACK: 	'#000', //#212121
	WHITE: 	'#ffffff'
};

export default Colors