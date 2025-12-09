# Element 5: Futuristic Platform & Floating Island

## 1. Project Overview

This element consists of two separate Babylon.js scenes that are created via factory functions:

1. A futuristic platform showcase with animated rings and glowing orbs in a metallic environment.

2. A stylized floating island diorama with trees, rocks, water and soft idle animation.

Together, these scenes demonstrate:

* asic scene setup (camera, lights, clear color).

* Use of StandardMaterial with custom colors and transparencies.

* Creation of environment geometry (ground, island, trees, rocks, water).

* Simple but effective animations using onBeforeRenderObservable.

* Use of shadows with ShadowGenerator to add depth and realism. 

## 2. Code Structure

Both scenes are defined as pure factory functions that accept a Babylon Engine and return an initialized Scene plus key references.

### File Breakdown

* Futuristic Platform Scene

>TypeScript

```code
export default function createShowcaseScene(engine: Engine) {
  const scene = new Scene(engine);
  // setup: camera, lights, sky, ground
  // content: platform, orbs, rotating rings
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
```
* Floating Island Scene

>TypeScript

```code
export default function createIslandScene(engine: Engine) {
  const scene = new Scene(engine);
  // setup: clearColor, camera, lights, shadows
  // content: islandRoot, island geometry, trees, rocks, water, animation
  return {
    scene,
    camera,
    islandRoot,
  };
}
```
This structure keeps each scene self-contained and easy to plug into a higher-level router or GUI.

## 3. Scene 1 — Futuristic Platform Showcase

This scene focuses on sci-fi shapes, glowing materials, and circular motion.

### 3.1 Environment Setup (Light, Camera, Sky)

The environment is built with:

* A HemisphericLight for soft ambient light.

* A PointLight above the center to add bright specular highlights.

* An ArcRotateCamera targeting the center of the scene.

* A skybox using an .env texture for reflections.

>TypeScript

```code
const hemi = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
hemi.intensity = 0.8;

const point = new PointLight("pointLight", new Vector3(0, 5, 0), scene);
point.intensity = 0.9;

const camera = new ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 3,
  15,
  new Vector3(0, 1.5, 0),
  scene
);

const envTex = new CubeTexture("./assets/textures/industrialSky.env", scene);
scene.environmentTexture = envTex;
const skybox = scene.createDefaultSkybox(envTex, true, 1000, 0.1) as Mesh;
```
The ground is a large plane with a metallic-looking texture and slightly tinted colors to reinforce a futuristic lab/platform theme.

### 3.2 Central Platform Composition

The central platform is built from three primary meshes:

1. Base Cylinder — a flat cylinder acting as the foundation.

2. Core Sphere — a glowing energy orb floating above the base.

3. Top Torus — a thin ring disc around the core.

>TypeScript

```code
const base = MeshBuilder.CreateCylinder("base", { diameter: 4, height: 0.4 }, scene);
base.position.y = 0.2;

const core = MeshBuilder.CreateSphere("coreSphere", { diameter: 1.2 }, scene);
core.position.y = 1.3;

const topDisc = MeshBuilder.CreateTorus("topDisc", { diameter: 2.8, thickness: 0.1 }, scene);
topDisc.position.y = 1.3;
```

Each part uses its own StandardMaterial with diffuse, specular, and emissive colors to create the feeling of shiny metal and glowing sci-fi energy.

### 3.3 Floating Orbs Logic

Around the platform, several small orbs orbit on a circular path while also moving up and down. This is done using trigonometry and the scene’s onBeforeRenderObservable.

* Orbs are evenly distributed around a radius.

* Each orb has its own angle that increases over time.

* Positions are updated each frame using Math.cos and Math.sin:

>TypeScript

```code
const count = 8;
const radius = 6;
const orbs: Mesh[] = [];
const angles: number[] = [];

// create orbs and initial angles
for (let i = 0; i < count; i++) {
  const orb = MeshBuilder.CreateSphere("orb" + i, { diameter: 0.6 }, scene);
  orbs.push(orb);
  angles.push((i / count) * Math.PI * 2);
}

// animation
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
```

### 3.4 Rotating Rings

Two torus rings spin around the core sphere:

* ring1 spins around the Y-axis.

* ring2 is rotated 90 degrees and spins around the Z-axis.

>TypeScript

```code
const ring1 = MeshBuilder.CreateTorus("ring1", { diameter: 3.5, thickness: 0.07 }, scene);
ring1.position.y = 2.2;

const ring2 = MeshBuilder.CreateTorus("ring2", { diameter: 3.5, thickness: 0.07 }, scene);
ring2.position.y = 2.2;
ring2.rotation.x = Math.PI / 2;

scene.onBeforeRenderObservable.add(() => {
  const dt = scene.getEngine().getDeltaTime() * 0.001;
  ring1.rotation.y += dt * 0.8;
  ring2.rotation.z -= dt * 0.6;
});
```
## 4. Scene 2 — Floating Island Diorama

The second scene is a low-poly floating island with trees, stones, water and subtle movement, rendered in a bright, stylized look.

### 4.1 Scene Setup (Color, Camera, Lights, Shadows)

The scene uses a light blue clearColor to simulate a sky background:

>TypeScript

```code
scene.clearColor = new Color4(0.6, 0.8, 1.0, 1.0);

const camera = new ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 3,
  12,
  new Vector3(0, 1, 0),
  scene
);
camera.attachControl(true);

const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
hemi.intensity = 0.7;

const dir = new DirectionalLight("dir", new Vector3(-1, -2, -1), scene);
dir.position = new Vector3(10, 10, 0);
dir.intensity = 0.9;

// shadows
const shadowGen = new ShadowGenerator(1024, dir);
shadowGen.useBlurExponentialShadowMap = true;
shadowGen.blurKernel = 16;
scene.shadowsEnabled = true;
```
## 4.2 Island Geometry (Top & Bottom)

The island is composed of:

* A flat box as the grassy top surface.

* A tapered cylinder underneath to create the illusion of a chunk of land floating in the air.

>TypeScript

```code
const islandRoot = new TransformNode("islandRoot", scene);

const grassMat = new StandardMaterial("grassMat", scene);
grassMat.diffuseColor = new Color3(0.3, 0.8, 0.4);

const top = MeshBuilder.CreateBox(
  "top",
  { width: 4, depth: 4, height: 0.4 },
  scene
);
top.position.y = 1.5;
top.material = grassMat;
top.receiveShadows = true;
top.parent = islandRoot;

const dirtMat = new StandardMaterial("dirtMat", scene);
dirtMat.diffuseColor = new Color3(0.4, 0.25, 0.15);

const bottom = MeshBuilder.CreateCylinder(
  "bottom",
  { diameterTop: 0.5, diameterBottom: 3.5, height: 2.5, tessellation: 6 },
  scene
);
bottom.position.y = 0.25;
bottom.material = dirtMat;
bottom.parent = islandRoot;
```
## 4.3 Trees, Rocks & Water

A helper function createTree builds simple trees from a small cylinder for the trunka and a sphere for the leaves.

>TypeScript

```code
function createTree(pos: Vector3) {
  const trunk = MeshBuilder.CreateCylinder(
    "trunk",
    { diameter: 0.2, height: 1 },
    scene
  );
  trunk.position = pos.clone();
  trunk.position.y = top.position.y + 0.5;
  trunk.parent = islandRoot;

  const leaves = MeshBuilder.CreateSphere(
    "leaves",
    { diameter: 1.2, segments: 6 },
    scene
  );
  leaves.position = trunk.position.clone();
  leaves.position.y += 0.8;
  leaves.parent = islandRoot;

  shadowGen.addShadowCaster(trunk);
  shadowGen.addShadowCaster(leaves);
}

createTree(new Vector3(-1.2, 0, -0.8));
createTree(new Vector3(1.0, 0, 0.5));
```
Rocks

>TypeScript

```code
function createRock(pos: Vector3, scale = 0.4) {
  const rock = MeshBuilder.CreateBox("rock", { size: 1 }, scene);
  rock.scaling = new Vector3(scale, scale * 0.6, scale * 0.8);
  rock.position = pos.clone();
  rock.position.y = top.position.y + 0.2;
  rock.parent = islandRoot;
  shadowGen.addShadowCaster(rock);
}

createRock(new Vector3(-0.5, 0, 1.2), 0.4);
createRock(new Vector3(1.3, 0, -1.0), 0.3);
createRock(new Vector3(0.8, 0, 1.0), 0.25);
```

>TypeScript

Water
```
const waterMat = new StandardMaterial("waterMat", scene);
waterMat.diffuseColor = new Color3(0.2, 0.4, 0.8);
waterMat.alpha = 0.7;

const water = MeshBuilder.CreateDisc(
  "water",
  { radius: 0.9, tessellation: 16 },
  scene
);
water.position = new Vector3(0.4, top.position.y + 0.01, 0);
water.rotation.x = Math.PI / 2;
water.material = waterMat;
water.parent = islandRoot;
```
## 4.4 Island Animation

To make the island feel alive, the entire islandRoot is rotated and moved up and down every frame:

>TypeScript

```code
let t = 0;
scene.onBeforeRenderObservable.add(() => {
  const dt = scene.getEngine().getDeltaTime() / 1000;
  t += dt;

  islandRoot.rotation.y += dt * 0.2;
  islandRoot.position.y = Math.sin(t * 1.2) * 0.15;
});
```
A hidden ground plane is placed below to receive shadows, but it is set to isVisible = false so only shadows are visible, not the actual plane.

# 5. How to Run

1. Open the project directory in your terminal.

2. Install dependencies:

>TypeScript

```code
npm install
```


3. Start the development server:

>TypeScript

```code
npm run dev
```


4. Open the local URL printed in the terminal and switch between the showcase platform and floating island scenes.
