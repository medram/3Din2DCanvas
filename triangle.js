import Colors from './colors.js'

export default function Triangle(v1, v2, v3, face = [], color=Colors.RED)
{
    this.v1 = v1
    this.v2 = v2
    this.v3 = v3
    this.color = color
    this.face = face
}
