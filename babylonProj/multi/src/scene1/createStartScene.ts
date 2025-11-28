// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";

// audio engine
import "@babylonjs/core/Audio/audioEngine";
import "@babylonjs/core/Audio/audioSceneComponent";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Light,
  Camera,
  Engine,
  CubeTexture,
  StandardMaterial,
  Texture,
  Color3,
} from "@babylonjs/core";

// light
function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.9;
  return light;
}

// camera
function createArcRotateCamera(scene: Scene) {
  const camAlpha = -Math.PI / 2;
  const camBeta = Math.PI / 2.5;
  const camDist = 10;
  const camTarget = new Vector3(0, 1, 0);

  const camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.attachControl(true);
  return camera;
}

// skybox
function createSky(scene: Scene): Mesh {
  const envTex = new CubeTexture("./assets/textures/industrialSky.env", scene);
  scene.environmentTexture = envTex;

  const skybox = scene.createDefaultSkybox(envTex, true, 1000, 0.1) as Mesh;
  return skybox;
}

// atom
function createAtom(scene: Scene) {
  // materials
  const silverMat = new StandardMaterial("silverMat", scene);
  silverMat.diffuseTexture = new Texture("./assets/textures/silver.jpg", scene);

  const goldMat = new StandardMaterial("goldMat", scene);
  goldMat.diffuseTexture = new Texture("./assets/textures/gold.jpg", scene);

  const miniMat = new StandardMaterial("miniMat", scene);
  miniMat.diffuseColor = new Color3(1, 1, 1);

  // nucleus
  const nucleus = MeshBuilder.CreateSphere("nucleus", { diameter: 1.5 }, scene);
  nucleus.position.y = 1;
  nucleus.material = silverMat;

  // electrons
  const electronCount = 10;
  const electrons: Mesh[] = [];
  const electronAngles = new Array(electronCount).fill(0);

  const radii = [2.0, 2.3, 2.6, 3.0, 3.3, 3.6, 4.0, 4.2, 4.5, 4.8];
  const speeds = [1.0, 1.4, 0.9, 1.6, 0.7, 1.3, 1.1, 0.5, 1.8, 0.6];

  // mini electrons
  const miniElectrons: Mesh[][] = [];
  const miniAngles: number[][] = [];

  for (let i = 0; i < electronCount; i++) {
    const e = MeshBuilder.CreateSphere(
      "electron" + i,
      { diameter: 0.25 },
      scene
    );
    e.material = goldMat;
    electrons.push(e);

    const numMini = 5;
    miniElectrons[i] = [];
    miniAngles[i] = new Array(numMini).fill(0);

    for (let j = 0; j < numMini; j++) {
      const m = MeshBuilder.CreateSphere(
        `mini${i}_${j}`,
        { diameter: 0.08 },
        scene
      );
      m.material = miniMat;
      miniElectrons[i].push(m);
    }
  }

  // animation
  scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime();
    const base = 0.0015;

    // rotate nucleus
    nucleus.rotation.y += dt * 0.0005;

    for (let i = 0; i < electronCount; i++) {
      electronAngles[i] += dt * base * speeds[i];
      const a = electronAngles[i];
      const r = radii[i];

      const ex = nucleus.position.x + Math.cos(a) * r;
      const ey = nucleus.position.y + Math.sin(a * 0.3) * 0.6;
      const ez = nucleus.position.z + Math.sin(a) * r;

      electrons[i].position.set(ex, ey, ez);

      const minis = miniElectrons[i];
      for (let j = 0; j < minis.length; j++) {
        miniAngles[i][j] += dt * base * (2 + j * 0.4);
        const ma = miniAngles[i][j];
        const mr = 0.4;

        minis[j].position.set(
          ex + Math.cos(ma) * mr,
          ey + Math.sin(ma) * mr * 0.7,
          ez + Math.sin(ma) * mr
        );
      }
    }
  });

  return { nucleus, electrons };
}

// main scene
export default function createStartScene(engine: Engine) {
  const scene = new Scene(engine);

  createLight(scene);
  createArcRotateCamera(scene);
  createSky(scene);

  const { nucleus, electrons } = createAtom(scene);

  return {
    scene,
    nucleus,
    electrons,
  };
}
