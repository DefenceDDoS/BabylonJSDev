
import "@babylonjs/core/Audio/audioEngine";
import "@babylonjs/core/Audio/audioSceneComponent";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  PointLight,
  MeshBuilder,
  Mesh,
  Engine,
  CubeTexture,
  StandardMaterial,
  Texture,
  Color3,
} from "@babylonjs/core";


// Light & Camera & Sky


function createLight(scene: Scene) {
  // Мягкий общий свет
  const hemi = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
  hemi.intensity = 0.8;

  // Точечный свет над центром, даёт красивые блики
  const point = new PointLight("pointLight", new Vector3(0, 5, 0), scene);
  point.intensity = 0.9;

  return { hemi, point };
}

function createCamera(scene: Scene) {
  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 3,
    15,
    new Vector3(0, 1.5, 0),
    scene
  );
  camera.attachControl(true);
  camera.wheelDeltaPercentage = 0.01; 
  return camera;
}

function createSky(scene: Scene): Mesh {
 
  const envTex = new CubeTexture("./assets/textures/industrialSky.env", scene);
  scene.environmentTexture = envTex;

  const skybox = scene.createDefaultSkybox(envTex, true, 1000, 0.1) as Mesh;
  return skybox;
}


// Ground


function createGround(scene: Scene): Mesh {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 30, height: 30 },
    scene
  );

  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseTexture = new Texture(
    "./assets/textures/silver.jpg", 
    scene
  );
  groundMat.diffuseColor = new Color3(0.2, 0.6, 1.0);
  groundMat.specularColor = new Color3(0.8, 0.8, 1.0);
  groundMat.emissiveColor = new Color3(0.05, 0.1, 0.2); 

  ground.material = groundMat;
  return ground;
}


// Platform


function createCenterPlatform(scene: Scene) {
  
  const base = MeshBuilder.CreateCylinder(
    "base",
    { diameter: 4, height: 0.4 },
    scene
  );
  base.position.y = 0.2;

  const baseMat = new StandardMaterial("baseMat", scene);
  baseMat.diffuseColor = new Color3(0.1, 0.1, 0.15);
  baseMat.specularColor = new Color3(0.8, 0.8, 0.8);
  baseMat.emissiveColor = new Color3(0.0, 0.1, 0.2);
  base.material = baseMat;

  
  const core = MeshBuilder.CreateSphere(
    "coreSphere",
    { diameter: 1.2 },
    scene
  );
  core.position.y = 1.3;

  const coreMat = new StandardMaterial("coreMat", scene);
  coreMat.diffuseColor = new Color3(0.2, 0.8, 1.0);
  coreMat.emissiveColor = new Color3(0.1, 0.5, 1.0);
  core.material = coreMat;

  
  const topDisc = MeshBuilder.CreateTorus(
    "topDisc",
    { diameter: 2.8, thickness: 0.1 },
    scene
  );
  topDisc.position.y = 1.3;

  const topMat = new StandardMaterial("topMat", scene);
  topMat.diffuseColor = new Color3(0.4, 0.4, 0.9);
  topMat.emissiveColor = new Color3(0.2, 0.2, 0.7);
  topDisc.material = topMat;

  return { base, core, topDisc };
}


// Spheres


function createFloatingOrbs(scene: Scene) {
  const count = 8;
  const radius = 6;
  const orbs: Mesh[] = [];
  const angles: number[] = [];

  const orbMat = new StandardMaterial("orbMat", scene);
  orbMat.diffuseColor = new Color3(1.0, 0.7, 0.2);
  orbMat.emissiveColor = new Color3(1.0, 0.5, 0.1);

  for (let i = 0; i < count; i++) {
    const orb = MeshBuilder.CreateSphere(
      "orb" + i,
      { diameter: 0.6 },
      scene
    );
    orb.material = orbMat;
    orbs.push(orb);

    angles.push((i / count) * Math.PI * 2);
  }

  scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime() * 0.001; 
    for (let i = 0; i < count; i++) {
      angles[i] += dt * 0.3; 
      const a = angles[i];

      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      const y = 1.2 + Math.sin(a * 2) * 0.5; 

      orbs[i].position.set(x, y, z);
    }
  });

  return orbs;
}

function createRotatingRings(scene: Scene) {
  const ring1 = MeshBuilder.CreateTorus(
    "ring1",
    { diameter: 3.5, thickness: 0.07 },
    scene
  );
  ring1.position.y = 2.2;

  const ring2 = MeshBuilder.CreateTorus(
    "ring2",
    { diameter: 3.5, thickness: 0.07 },
    scene
  );
  ring2.position.y = 2.2;
  ring2.rotation.x = Math.PI / 2;

  const ringMat = new StandardMaterial("ringMat", scene);
  ringMat.diffuseColor = new Color3(0.8, 0.8, 1.0);
  ringMat.emissiveColor = new Color3(0.3, 0.3, 0.9);
  ring1.material = ringMat;
  ring2.material = ringMat;

  scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime() * 0.001;
    ring1.rotation.y += dt * 0.8;
    ring2.rotation.z -= dt * 0.6;
  });

  return { ring1, ring2 };
}

// Scene

export default function createShowcaseScene(engine: Engine) {
  const scene = new Scene(engine);

  const camera = createCamera(scene);
  const { hemi, point } = createLight(scene);
  const sky = createSky(scene);
  const ground = createGround(scene);

  const platform = createCenterPlatform(scene);
  const orbs = createFloatingOrbs(scene);
  const rings = createRotatingRings(scene);

  return {
    scene,
    camera,
    hemi,
    point,
    sky,
    ground,
    platform,
    orbs,
    rings,
  };
}
