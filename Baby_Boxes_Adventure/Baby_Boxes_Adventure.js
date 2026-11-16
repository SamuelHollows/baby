//samuel hollows

"use strict";

(() => {
  const canvas = document.getElementById("renderCanvas");
  const status = document.getElementById("model-status");
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
  });

  const makeMaterial = (name, hex, roughness = 0.7, metallic = 0) => {
    const material = new BABYLON.PBRMaterial(name, scene);
    material.albedoColor = BABYLON.Color3.FromHexString(hex);
    material.roughness = roughness;
    material.metallic = metallic;
    return material;
  };

  let scene;

  const createScene = async () => {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color4.FromHexString("#eaf0fb");
    scene.ambientColor = new BABYLON.Color3(0.35, 0.35, 0.35);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 3,
      1.12,
      27,
      new BABYLON.Vector3(0, 3.1, 0),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 13;
    camera.upperRadiusLimit = 42;
    camera.lowerBetaLimit = 0.35;
    camera.upperBetaLimit = Math.PI / 2.05;
    camera.wheelPrecision = 45;
    camera.panningSensibility = 90;

    const hemi = new BABYLON.HemisphericLight(
      "soft sky light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemi.intensity = 0.8;
    hemi.groundColor = BABYLON.Color3.FromHexString("#8a9ab8");

    const keyLight = new BABYLON.DirectionalLight(
      "sun",
      new BABYLON.Vector3(-0.45, -1, 0.35),
      scene
    );
    keyLight.position = new BABYLON.Vector3(8, 15, -8);
    keyLight.intensity = 1.6;

    const shadows = new BABYLON.ShadowGenerator(1024, keyLight);
    shadows.useBlurExponentialShadowMap = true;
    shadows.blurKernel = 18;

    const ground = BABYLON.MeshBuilder.CreateGround(
      "display floor",
      { width: 34, height: 25 },
      scene
    );
    ground.position.y = -0.08;
    ground.material = makeMaterial("warm porcelain floor", "#dce5f2", 0.92);
    ground.receiveShadows = true;

    const stage = BABYLON.MeshBuilder.CreateCylinder(
      "round display stage",
      { height: 0.3, diameter: 19, tessellation: 96 },
      scene
    );
    stage.position.y = 0.08;
    stage.material = makeMaterial("stage blue", "#b9c9e2", 0.76);
    stage.receiveShadows = true;
    shadows.addShadowCaster(stage);

    const box = (name, width, height, depth, position, color, rotation = 0) => {
      const mesh = BABYLON.MeshBuilder.CreateBox(
        name,
        { width, height, depth },
        scene
      );
      mesh.position.copyFrom(position);
      mesh.rotation.y = rotation;
      mesh.material = makeMaterial(`${name} material`, color, 0.62);
      mesh.receiveShadows = true;
      shadows.addShadowCaster(mesh);
      return mesh;
    };

    // The main stack is aligned face-to-face so the box-on-box construction reads clearly.
    box("bottom stacked box", 4.4, 2, 4.1, new BABYLON.Vector3(0, 1.3, 0), "#3977b9");
    box("middle stacked box", 3.35, 1.65, 3.25, new BABYLON.Vector3(0, 3.125, 0), "#f2bf57", 0.035);
    box("top stacked box", 2.45, 1.5, 2.4, new BABYLON.Vector3(0, 4.7, 0), "#e87567", -0.035);

    box("left stack lower box", 2.45, 1.3, 2.4, new BABYLON.Vector3(-6.3, 0.95, 0.5), "#58a68c", -0.08);
    box("left stack upper box", 1.9, 1.25, 1.9, new BABYLON.Vector3(-6.3, 2.225, 0.5), "#8f78bd", 0.06);

    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "floating sphere",
      { diameter: 1.65, segments: 32 },
      scene
    );
    sphere.position.set(4.5, 1.25, 4);
    sphere.material = makeMaterial("coral sphere", "#fa8d70", 0.28, 0.08);
    shadows.addShadowCaster(sphere);

    const torus = BABYLON.MeshBuilder.CreateTorus(
      "golden ring",
      { diameter: 2.25, thickness: 0.38, tessellation: 64 },
      scene
    );
    torus.position.set(5.2, 2.1, -3.1);
    torus.rotation.x = Math.PI / 2.6;
    torus.material = makeMaterial("golden ring material", "#e7b749", 0.26, 0.55);
    shadows.addShadowCaster(torus);
    scene.onBeforeRenderObservable.add(() => {
      torus.rotation.y += engine.getDeltaTime() * 0.00016;
    });

    const cone = BABYLON.MeshBuilder.CreateCylinder(
      "mint cone",
      { height: 2.5, diameterTop: 0, diameterBottom: 2.2, tessellation: 48 },
      scene
    );
    cone.position.set(-4.3, 1.4, 4.8);
    cone.material = makeMaterial("mint cone material", "#58b8b2", 0.38);
    shadows.addShadowCaster(cone);

    const cylinder = BABYLON.MeshBuilder.CreateCylinder(
      "violet cylinder",
      { height: 1.8, diameter: 1.5, tessellation: 48 },
      scene
    );
    cylinder.position.set(-5.1, 1.05, -3.2);
    cylinder.material = makeMaterial("violet cylinder material", "#9d86d2", 0.35);
    shadows.addShadowCaster(cylinder);

    const modelTargets = [
      { file: "HeartFinalized.glb", position: new BABYLON.Vector3(-8.1, 1.7, 1.4), size: 3.2 },
      { file: "Avocado.glb", position: new BABYLON.Vector3(7.5, 1.2, 1.7), size: 3.3 },
      { file: "WaterBottle.glb", position: new BABYLON.Vector3(7.4, 2.3, -3.8), size: 4.2 }
    ];

    const loadModel = async ({ file, position, size }) => {
      const imported = await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "assets/",
        file,
        scene
      );
      const geometryMeshes = imported.meshes.filter((mesh) => mesh.getTotalVertices() > 0);

      if (geometryMeshes.length === 0) {
        throw new Error(`${file} loaded without any renderable mesh.`);
      }

      imported.meshes.forEach((mesh) => mesh.computeWorldMatrix(true));
      const min = new BABYLON.Vector3(Infinity, Infinity, Infinity);
      const max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

      geometryMeshes.forEach((mesh) => {
        const bounds = mesh.getBoundingInfo().boundingBox;
        min.x = Math.min(min.x, bounds.minimumWorld.x);
        min.y = Math.min(min.y, bounds.minimumWorld.y);
        min.z = Math.min(min.z, bounds.minimumWorld.z);
        max.x = Math.max(max.x, bounds.maximumWorld.x);
        max.y = Math.max(max.y, bounds.maximumWorld.y);
        max.z = Math.max(max.z, bounds.maximumWorld.z);
        mesh.isPickable = true;
        mesh.receiveShadows = true;
      });

      const dimensions = max.subtract(min);
      const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
      if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
        throw new Error(`${file} has invalid model bounds.`);
      }

      const center = min.add(max).scale(0.5);
      const scale = size / largestDimension;
      const root = new BABYLON.TransformNode(`${file} placement`, scene);
      imported.meshes
        .filter((mesh) => mesh.parent === null)
        .forEach((mesh) => {
          mesh.parent = root;
        });
      root.scaling.setAll(scale);
      root.position = position.subtract(center.scale(scale));
      geometryMeshes.forEach((mesh) => shadows.addShadowCaster(mesh));
    };

    const results = await Promise.allSettled(modelTargets.map(loadModel));
    const failures = results
      .map((result, index) => ({ result, file: modelTargets[index].file }))
      .filter(({ result }) => result.status === "rejected");

    if (failures.length > 0) {
      failures.forEach(({ result, file }) => {
        console.error(`Could not load ${file}:`, result.reason);
      });
      status.dataset.state = "error";
      status.textContent = `Model loading issue: ${failures.map(({ file }) => file).join(", ")}. See console for details.`;
    } else {
      status.dataset.state = "ready";
      status.textContent = `All ${modelTargets.length} GLB models loaded`;
    }

    return scene;
  };

  createScene()
    .then(() => {
      engine.runRenderLoop(() => scene.render());
    })
    .catch((error) => {
      console.error("Could not create the scene:", error);
      status.dataset.state = "error";
      status.textContent = "The scene could not start. See the browser console for details.";
    });

  window.addEventListener("resize", () => engine.resize());
})();
