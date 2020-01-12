const Colors = {
	RED: 	'#EC407A',
	GREEN: 	'#8BC34A',
	BLUE: 	'#00B0FF',
	PURPLE: '#AB47BC',
	YELLOW: '#FFD600',
	ORANGE: '#F9A825',
	BLACK: 	'#000', //#212121
	WHITE: 	'#ffffff'
};

// color generator
function *colorGenerator()
{
    let keys = Object.keys(Colors)
    
    for (let i = 0; i < keys.length; i++)
    {
        yield Colors[keys[i]]
        
        if (i+1 == keys.length)
            i = 0
    }
}

let nxtcolor = colorGenerator()

export const nextColor = () => {
	return nxtcolor.next().value
}

export default Colors