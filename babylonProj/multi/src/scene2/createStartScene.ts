import {
  Scene,
  Engine,
  Vector3,
  Color3,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  TransformNode,
} from "@babylonjs/core";

export default function createIslandScene(engine: Engine) {
  const scene = new Scene(engine);

  
  scene.clearColor = new Color4(0.6, 0.8, 1.0, 1.0);

  // camers
  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 3,
    12,
    new Vector3(0, 1, 0),
    scene
  );
  camera.attachControl(true);

  // lights
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

  
  const islandRoot = new TransformNode("islandRoot", scene);

  // island
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

  // tree
  function createTree(pos: Vector3) {
    const trunkMat = new StandardMaterial("trunkMat", scene);
    trunkMat.diffuseColor = new Color3(0.35, 0.2, 0.1);

    const leavesMat = new StandardMaterial("leavesMat", scene);
    leavesMat.diffuseColor = new Color3(0.15, 0.6, 0.25);

    const trunk = MeshBuilder.CreateCylinder(
      "trunk",
      { diameter: 0.2, height: 1 },
      scene
    );
    trunk.position = pos.clone();
    trunk.position.y = top.position.y + 0.5;
    trunk.material = trunkMat;
    trunk.parent = islandRoot;

    const leaves = MeshBuilder.CreateSphere(
      "leaves",
      { diameter: 1.2, segments: 6 },
      scene
    );
    leaves.position = trunk.position.clone();
    leaves.position.y += 0.8;
    leaves.material = leavesMat;
    leaves.parent = islandRoot;

    shadowGen.addShadowCaster(trunk);
    shadowGen.addShadowCaster(leaves);
  }

  createTree(new Vector3(-1.2, 0, -0.8));
  createTree(new Vector3(1.0, 0, 0.5));

  // stones
  const rockMat = new StandardMaterial("rockMat", scene);
  rockMat.diffuseColor = new Color3(0.6, 0.6, 0.65);

  function createRock(pos: Vector3, scale = 0.4) {
    const rock = MeshBuilder.CreateBox("rock", { size: 1 }, scene);
    rock.scaling = new Vector3(scale, scale * 0.6, scale * 0.8);
    rock.position = pos.clone();
    rock.position.y = top.position.y + 0.2;
    rock.material = rockMat;
    rock.parent = islandRoot;
    shadowGen.addShadowCaster(rock);
  }

  createRock(new Vector3(-0.5, 0, 1.2), 0.4);
  createRock(new Vector3(1.3, 0, -1.0), 0.3);
  createRock(new Vector3(0.8, 0, 1.0), 0.25);

  // water
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

  // island animation
  let t = 0;
  scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime() / 1000;
    t += dt;

    islandRoot.rotation.y += dt * 0.2;
    islandRoot.position.y = Math.sin(t * 1.2) * 0.15;
  });

  // ground
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );
  ground.position.y = -1.5;
  ground.receiveShadows = true;
  ground.isVisible = false;

  return {
    scene,
    camera,
    islandRoot,
  };
}
