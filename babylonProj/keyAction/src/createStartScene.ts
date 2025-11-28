import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { SceneData } from "./interfaces";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  AnimationPropertiesOverride,
  CubeTexture,
} from "@babylonjs/core";



let keyDownMap: { [key: string]: boolean } = {};

const normalizeKey = (key: string): string => {
  if (key.length === 1) return key.toLowerCase();
  return key;
};

function actionManager(scene: Scene) {
  scene.actionManager = new ActionManager(scene);

  scene.actionManager.registerAction(
    new ExecuteCodeAction(
      { trigger: ActionManager.OnKeyDownTrigger },
      (evt) => {
        const k = normalizeKey(evt.sourceEvent.key);
        keyDownMap[k] = true;
      }
    )
  );

  scene.actionManager.registerAction(
    new ExecuteCodeAction(
      { trigger: ActionManager.OnKeyUpTrigger },
      (evt) => {
        const k = normalizeKey(evt.sourceEvent.key);
        keyDownMap[k] = false;
      }
    )
  );

  return scene.actionManager;
}

// sky

function createArcRotateCamera(scene: Scene) {
  const camera = new ArcRotateCamera(
    "camera1",
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new Vector3(0, 0, 0),
    scene
  );
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 30;
  camera.attachControl(true);

  scene.activeCamera = camera;
  return camera;
}

function createSky(scene: Scene): Mesh {
  const envTex = new CubeTexture("./assets/textures/industrialSky.env", scene);
  scene.environmentTexture = envTex;

  const skybox = scene.createDefaultSkybox(envTex, true, 1000, 0.1) as Mesh;
  return skybox;
}

// floor

function createGround(scene: Scene): Mesh {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 50, height: 50 },
    scene
  );

  const groundMat = new StandardMaterial("groundMat", scene);
  const tex = new Texture("./assets/textures/floor.jpg", scene);

  tex.uScale = 10;
  tex.vScale = 10;
  tex.anisotropicFilteringLevel = 8;

  groundMat.diffuseTexture = tex;
  groundMat.specularColor = new Color3(0, 0, 0);

  ground.material = groundMat;
  ground.checkCollisions = true;

  return ground;
}

// fence

function createWoodMaterial(scene: Scene): StandardMaterial {
  const mat = new StandardMaterial("woodMat", scene);
  const texWood = new Texture("./assets/textures/wood.jpg", scene);

  texWood.uScale = 1;
  texWood.vScale = 1;

  mat.diffuseTexture = texWood;
  mat.specularColor = new Color3(0, 0, 0);

  return mat;
}

function createFenceSection(scene: Scene, length: number): Mesh {
  const fence = MeshBuilder.CreateBox(
    "fenceSection",
    { width: length, height: 2, depth: 0.2 },
    scene
  );

  fence.checkCollisions = true;
  return fence;
}

function createFenceAround(scene: Scene): void {
  const woodMat = createWoodMaterial(scene);

  const size = 50;
  const half = size / 2;
  const fenceLength = size;

  const north = createFenceSection(scene, fenceLength);
  north.material = woodMat;
  north.position = new Vector3(0, 1, -half);

  const south = createFenceSection(scene, fenceLength);
  south.material = woodMat;
  south.position = new Vector3(0, 1, half);

  const east = createFenceSection(scene, fenceLength);
  east.material = woodMat;
  east.rotation.y = Math.PI / 2;
  east.position = new Vector3(half, 1, 0);

  const west = createFenceSection(scene, fenceLength);
  west.material = woodMat;
  west.rotation.y = Math.PI / 2;
  west.position = new Vector3(-half, 1, 0);
}

// boxes

function createCrate(scene: Scene): Mesh {
  const crateMat = new StandardMaterial("crateMat", scene);
  const tex = new Texture("./assets/textures/crate.png", scene);

  tex.uScale = 1;
  tex.vScale = 1;
  crateMat.diffuseTexture = tex;
  crateMat.specularColor = new Color3(0, 0, 0);

  const crate = MeshBuilder.CreateBox("crate", { size: 2 }, scene);

  crate.material = crateMat;
  crate.position.y = 1;
  crate.checkCollisions = true;

  return crate;
}

function createCrates(scene: Scene) {
  const baseCrate = createCrate(scene);
  baseCrate.position = new Vector3(-3, 1, 5);

  const positions = [
    new Vector3(3, 1, 5),
    new Vector3(9, 1, 10),
    new Vector3(9, 1, 5),
    new Vector3(-3, 1, 10),
    new Vector3(3, 1, 10),
  ];

  positions.forEach((pos, i) => {
    const inst = baseCrate.createInstance("crateInst_" + i);
    inst.position = pos;
    inst.checkCollisions = true;
  });
}

// player

function importPlayerMesh(scene: Scene, x: number, y: number) {
  const item = SceneLoader.ImportMesh(
    "",
    "./assets/models/men/",
    "dummy3.babylon",
    scene,
    (newMeshes, _particleSystems, skeletons) => {
      const mesh = newMeshes[0];
      const skeleton = skeletons[0];

      skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
      skeleton.animationPropertiesOverride.enableBlending = true;
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
      skeleton.animationPropertiesOverride.loopMode = 1;

      const walkRange: any = skeleton.getAnimationRange("YBot_Walk");
      let animating = false;

      mesh.scaling = new Vector3(1, 1, 1);
      mesh.position = new Vector3(x, 0, y);

      mesh.checkCollisions = true;
      mesh.ellipsoid = new Vector3(0.5, 1, 0.5);
      mesh.ellipsoidOffset = new Vector3(0, 1, 0);

      const arcCam = scene.activeCamera as ArcRotateCamera;
      if (arcCam) {
        arcCam.lockedTarget = mesh;
        arcCam.radius = 15;
        arcCam.beta = Math.PI / 3;
      }

      scene.onBeforeRenderObservable.add(() => {
        let keydown = false;

        const baseSpeed = 0.1;
        const runMultiplier = keyDownMap["Shift"] ? 2.0 : 1.0;
        const speed = baseSpeed * runMultiplier;

        if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
          mesh.rotation.y = 0;
          mesh.moveWithCollisions(new Vector3(0, 0, speed));
          keydown = true;
        }

        if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
          mesh.rotation.y = (3 * Math.PI) / 2;
          mesh.moveWithCollisions(new Vector3(-speed, 0, 0));
          keydown = true;
        }

        if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
          mesh.rotation.y = Math.PI;
          mesh.moveWithCollisions(new Vector3(0, 0, -speed));
          keydown = true;
        }

        if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
          mesh.rotation.y = Math.PI / 2;
          mesh.moveWithCollisions(new Vector3(speed, 0, 0));
          keydown = true;
        }

        if (keydown) {
          if (!animating) {
            animating = true;
            if (walkRange) {
              scene.beginAnimation(
                skeleton,
                walkRange.from,
                walkRange.to,
                true
              );
            }
          }
        } else {
          animating = false;
          scene.stopAnimation(skeleton);
        }
      });
    }
  );

  return item;
}

// scene

export default function createStartScene(engine: Engine): SceneData {
  const scene = new Scene(engine);

  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.3, 0);

  const ground = createGround(scene);
  const sky = createSky(scene);

  createCrates(scene);
  createFenceAround(scene);

  const lightHemispheric = new HemisphericLight(
    "lightHemispheric",
    new Vector3(0, 1, 0),
    scene
  );
  lightHemispheric.intensity = 0.7;

  const camera = createArcRotateCamera(scene);

  const that: SceneData = {
    scene,
    ground,
    sky,
    lightHemispheric,
    camera,
  };

  that.importMesh = importPlayerMesh(that.scene, 0, 0);
  that.actionManager = actionManager(that.scene);

  window.addEventListener("keydown", (ev) => {
    if (ev.key === "i") {
      if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
      } else {
        scene.debugLayer.show();
      }
    }
  });

  return that;
}
