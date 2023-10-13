# 3Din2DCanvas !
Hi there!
I've just created the 3D from scratch in 2D canvas (reinventing the wheel) using just pure Javascript, Based on some 3D algorithms.

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_1.png)

# Features:
This 3D supports the folowing features:
- Z Buffer for depth testing.
- FrameBuffer (useful for making cool filters like Anti-aliasing, Motion blur, Depth fading & mush more...)
- Filling the triangles & coloring it.
- Parallel Lighting (like sun light).
- Culling support (clipping in View space).
- Rendering lines from A to B & coloring it.

# Cons:
- It's slow because of javascript.
- Lines rendring could be improved.

# Next/coming soon Features:
I will add these features on future:
- Anti-Aliasing (FXAA).
- improving lines rendring.
- increasing FPS by improving/optimizing code and algorithms.
- Texturing.
- Smooth shading.

# How to use:
Make sure you have PHP installed on your system (needed to deliver ".obj" files to browsers).
To start a php server on the root folder of 3Din2Dcanvas, you could run this command on your terminal:
```
php -S localhost:5500
```
And go to the browser & tap localhost:5500, and just make sure to resize your browser's tab into a small resolution (e.g. 500x400)
And there you go :D

## Camera Controler & rendering modes:
To control the camera, you could use (Z, D, S, Q) buttons with (Up, Down, Left and Right) arrows on your keyboard to control camera position and direction.
In addition, you could enable/disable some modes using your keyboard number pad:
- Enable/disable Clipping mode (click 2 number).
- Enable/disable Fake normals mode (click 3 number).
- Log camera info on console (click 4 number).
- Enable/disable Draw lines mode (click 5 number).
- Enable/disable Fill triangles mode (click 6 number).
# Log:
You could check out browser's console for log.

# Screensots:

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_2.png)

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_3.png)

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_4.png)

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_5.png)

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_6.png)

![](https://raw.githubusercontent.com/medram/3Din2DCanvas/master/imgs/cover_7.png)


