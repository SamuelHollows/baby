# Baby Boxes Adventure

An interactive Babylon.js scene with stacked boxes, additional primitive shapes, and three GLB models.

## Run locally

GLB files must be served over HTTP; opening `index.html` directly as a file will not load them. From this folder, run:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000> in a browser. Stop the local server with Ctrl+C.

## Models and credits

- `HeartFinalized.glb` was supplied with the starter project.
- `Avocado.glb` and `WaterBottle.glb` are from the Khronos Group glTF Sample Assets project and are marked CC0 1.0 Universal:
  - <https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Avocado>
  - <https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/WaterBottle>

Babylon.js and the glTF loader are loaded from the Babylon.js CDN, so the page also needs an internet connection.

## GitHub Pages

The folder is ready to publish as the root of a GitHub Pages site. Once published, the site URL can be used to generate a QR code for the class presentation.
