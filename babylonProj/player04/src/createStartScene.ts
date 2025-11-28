import "@babylonjs/loaders/glTF/2.0";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";

import {
  Scene,
  ArcRotateCamera,
  AssetsManager,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Camera,
  Engine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
  Color3,
  StandardMaterial,
  Texture,
  CubeTexture,             
  
} from "@babylonjs/core";


// light
function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

// ground
function createGround(scene: Scene) {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 40, height: 80 },
    scene
  );

  const groundMat = new StandardMaterial("groundMat", scene);

  const tex = new Texture("./assets/textures/grass.jpg", scene);

  
  tex.uScale = 8;   
  tex.vScale = 16;  

  
  tex.wrapU = Texture.WRAP_ADDRESSMODE;
  tex.wrapV = Texture.WRAP_ADDRESSMODE;

  
  tex.anisotropicFilteringLevel = 8; 

  groundMat.diffuseTexture = tex;
  groundMat.specularColor = new Color3(0, 0, 0);
  ground.material = groundMat;

  const groundAggregate = new PhysicsAggregate(
    ground,
    PhysicsShapeType.BOX,
    { mass: 0, restitution: 0.1, friction: 0.8 },
    scene
  );

  return groundAggregate;
}

 // gates
function createGoals(scene: Scene) {
  
  const FIELD_WIDTH = 40;
  const FIELD_DEPTH = 80;

  const halfW = FIELD_WIDTH / 2;   
  const halfD = FIELD_DEPTH / 2;   

 
  const goalWidth = 8;          
  const goalHeight = 4;        
  const poleThickness = 0.3;    

  
  const goalMat = new StandardMaterial("goalMat", scene);
  goalMat.diffuseColor = new Color3(0.9, 0.85, 0.7);

  
  function createOneGoal(zPos: number, namePrefix: string) {
    
    const leftPost = MeshBuilder.CreateBox(
      namePrefix + "_leftPost",
      { width: poleThickness, height: goalHeight, depth: poleThickness },
      scene
    );
    leftPost.position = new Vector3(-goalWidth / 2, goalHeight / 2, zPos);
    leftPost.material = goalMat;
    new PhysicsAggregate(leftPost, PhysicsShapeType.BOX, { mass: 0 }, scene);

    
    const rightPost = MeshBuilder.CreateBox(
      namePrefix + "_rightPost",
      { width: poleThickness, height: goalHeight, depth: poleThickness },
      scene
    );
    rightPost.position = new Vector3(+goalWidth / 2, goalHeight / 2, zPos);
    rightPost.material = goalMat;
    new PhysicsAggregate(rightPost, PhysicsShapeType.BOX, { mass: 0 }, scene);

    
    const topBar = MeshBuilder.CreateBox(
      namePrefix + "_topBar",
      { width: goalWidth, height: poleThickness, depth: poleThickness },
      scene
    );
    topBar.position = new Vector3(0, goalHeight, zPos);
    topBar.material = goalMat;
    new PhysicsAggregate(topBar, PhysicsShapeType.BOX, { mass: 0 }, scene);
  }

  
  createOneGoal(-halfD + 0.5, "goalFront");
  createOneGoal(+halfD - 0.5, "goalBack");
}


// camera
function createArcRotateCamera(scene: Scene) {
  const camAlpha = -Math.PI / 2;
  const camBeta = Math.PI / 2.5;
  const camDist = 10;
  const camTarget = new Vector3(0, 0, 0);

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

// boxes 
function createBox1(scene: Scene) {
  const COUNT = 5;
  const BOX_SIZE = 1;
  const START_POS = new Vector3(-4, 0.1, 1);

  let lastAggregate: PhysicsAggregate | null = null;

  for (let i = 0; i < COUNT; i++) {
    const box = MeshBuilder.CreateBox(
      "box_stack_" + i,
      { width: BOX_SIZE, height: BOX_SIZE, depth: BOX_SIZE },
      scene
    );

    
    box.position = new Vector3(
      START_POS.x,
      START_POS.y + i * BOX_SIZE,
      START_POS.z
    );

    
    const texture = new StandardMaterial("boxMat_" + i, scene);
    texture.ambientTexture = new Texture("./assets/textures/crate.png", scene);
    texture.diffuseColor = new Color3(1, 1, 1);
    box.material = texture;

    
    const agg = new PhysicsAggregate(
      box,
      PhysicsShapeType.BOX,
      { mass: 0.4, restitution: 0.1, friction: 0.6 },
      scene
    );

    agg.body.setCollisionCallbackEnabled(true);

    lastAggregate = agg; 
  }

  return lastAggregate!; 
}
function createBox3(scene: Scene) {
  const COUNT = 5;
  const BOX_SIZE = 1;
  const START_POS = new Vector3(5, 0.1, 0);

  let lastAggregate: PhysicsAggregate | null = null;

  for (let i = 0; i < COUNT; i++) {
    const box = MeshBuilder.CreateBox(
      "box_stack_" + i,
      { width: BOX_SIZE, height: BOX_SIZE, depth: BOX_SIZE },
      scene
    );

    
    box.position = new Vector3(
      START_POS.x,
      START_POS.y + i * BOX_SIZE,
      START_POS.z
    );

    
    const texture = new StandardMaterial("boxMat_" + i, scene);
    texture.ambientTexture = new Texture("./assets/textures/crate.png", scene);
    texture.diffuseColor = new Color3(1, 1, 1);
    box.material = texture;

    
    const agg = new PhysicsAggregate(
      box,
      PhysicsShapeType.BOX,
      { mass: 0.4, restitution: 0.1, friction: 0.6 },
      scene
    );

    agg.body.setCollisionCallbackEnabled(true);

    lastAggregate = agg; 
  }

  return lastAggregate!; 
}


function createBox2(scene: Scene) {
 
  const radius = 1;


  const ball = MeshBuilder.CreateSphere(
    "ball",
    { diameter: radius * 2, segments: 16 },
    scene
  );

  
  ball.position.x = 5;
  ball.position.y = 2;   
  ball.position.z = 1;

  
  const ballMat = new StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new Color3(1, 0, 0);      
  ballMat.specularColor = new Color3(0.2, 0.2, 0.2);
  ball.material = ballMat;

  
  const ballAgg = new PhysicsAggregate(
    ball,
    PhysicsShapeType.SPHERE,          
    {
      mass: 1,                        
      restitution: 0.2,               
      friction: 0.8,                  
    },
    scene
  );

  
  ballAgg.body.setLinearDamping(0.05);
  ballAgg.body.setAngularDamping(0.05);

  return ballAgg;
}
// trees
function addAssets(scene: Scene) {
  const assetsManager = new AssetsManager(scene);

  
  const GROUND_WIDTH = 40;
  const GROUND_DEPTH = 80;
  const halfW = GROUND_WIDTH / 2;  
  const halfD = GROUND_DEPTH / 2;  
  const margin = 1;                

  
  const SPAWN_W = GROUND_WIDTH + 20; 
  const SPAWN_D = GROUND_DEPTH + 20;

  
  const getOutsidePosition = () => {
    let x = 0;
    let z = 0;

    do {
      x = (Math.random() - 0.5) * SPAWN_W; 
      z = (Math.random() - 0.5) * SPAWN_D;
      
    } while (Math.abs(x) <= halfW + margin && Math.abs(z) <= halfD + margin);

    return new Vector3(x, 0, z);
  };

  
  const tree1 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_1.gltf"
  );
  tree1.onSuccess = (task) => {
    const root = task.loadedMeshes[0];
    root.scaling = new Vector3(0.5, 0.5, 0.5);

    
    root.position = getOutsidePosition();

    
    const COUNT = 100;
    for (let i = 0; i < COUNT; i++) {
      const clone = root.clone("tree1_clone_" + i, null)!;
      clone.position = getOutsidePosition();
    }
  };

  
  const tree2 = assetsManager.addMeshTask(
    "tree2 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_2.gltf"
  );
  tree2.onSuccess = (task) => {
    const root = task.loadedMeshes[0];
    root.scaling = new Vector3(0.5, 0.5, 0.5);
    root.position = getOutsidePosition();

    const COUNT = 100;
    for (let i = 0; i < COUNT; i++) {
      const clone = root.clone("tree2_clone_" + i, null)!;
      clone.position = getOutsidePosition();
    }
  };

  
  const tree3 = assetsManager.addMeshTask(
    "tree3 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_3.gltf"
  );
  tree3.onSuccess = (task) => {
    const root = task.loadedMeshes[0];
    root.scaling = new Vector3(0.5, 0.5, 0.5);
    root.position = getOutsidePosition();

    const COUNT = 100;
    for (let i = 0; i < COUNT; i++) {
      const clone = root.clone("tree3_clone_" + i, null)!;
      clone.position = getOutsidePosition();
    }
  };

  assetsManager.onTaskErrorObservable.add((task) => {
    console.log(
      "task failed",
      task.errorObject.message,
      task.errorObject.exception
    );
  });

  return assetsManager;
}


// fences
function createWalls(scene: Scene) {
  const groundWidth = 40;
  const groundDepth = 80;
  const halfW = groundWidth / 2;  
  const halfD = groundDepth / 2; 

  const wallHeight = 3;
  const wallThickness = 1;

  const wallMat = new StandardMaterial("wallMat", scene);
  wallMat.diffuseTexture = new Texture("./assets/textures/wood.jpg", scene);
  wallMat.specularColor = new Color3(0, 0, 0);

  
  const north = MeshBuilder.CreateBox(
    "wallNorth",
    { width: groundWidth, height: wallHeight, depth: wallThickness },
    scene
  );
  north.position = new Vector3(0, wallHeight / 2, -halfD);
  north.material = wallMat;
  new PhysicsAggregate(north, PhysicsShapeType.BOX, { mass: 0 }, scene);

 
  const south = MeshBuilder.CreateBox(
    "wallSouth",
    { width: groundWidth, height: wallHeight, depth: wallThickness },
    scene
  );
  south.position = new Vector3(0, wallHeight / 2, halfD);
  south.material = wallMat;
  new PhysicsAggregate(south, PhysicsShapeType.BOX, { mass: 0 }, scene);

  
  const west = MeshBuilder.CreateBox(
    "wallWest",
    { width: wallThickness, height: wallHeight, depth: groundDepth },
    scene
  );
  west.position = new Vector3(-halfW, wallHeight / 2, 0);
  west.material = wallMat;
  new PhysicsAggregate(west, PhysicsShapeType.BOX, { mass: 0 }, scene);

  
  const east = MeshBuilder.CreateBox(
    "wallEast",
    { width: wallThickness, height: wallHeight, depth: groundDepth },
    scene
  );
  east.position = new Vector3(halfW, wallHeight / 2, 0);
  east.material = wallMat;
  new PhysicsAggregate(east, PhysicsShapeType.BOX, { mass: 0 }, scene);
}

// sky

function createSky(scene: Scene) {
  
  const envTex = new CubeTexture(
    "./assets/textures/industrialSky.env",
    scene
  );

  scene.environmentTexture = envTex;

  
  scene.createDefaultSkybox(envTex, true, 1000, 0.1);
}


// start
export default async function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    light?: HemisphericLight;
    ground?: PhysicsAggregate;
    camera?: Camera;
    box1?: PhysicsAggregate;
    box2?: PhysicsAggregate;
  }

  const that: SceneData = { scene: new Scene(engine) };

  let initializedHavok: any;
  HavokPhysics().then((havok) => {
    initializedHavok = havok;
  });

  const havokInstance: HavokPhysicsWithBindings = await HavokPhysics();
  const hk: HavokPlugin = new HavokPlugin(true, havokInstance);
  that.scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

  
  createSky(that.scene);
  createGoals(that.scene);
  that.light = createLight(that.scene);
  that.ground = createGround(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  that.box1 = createBox1(that.scene);
  that.box2 = createBox2(that.scene);
  that.box2 = createBox3(that.scene);
  

  const assetsManager = addAssets(that.scene);
  assetsManager.load();

  // стены вокруг платформы
  createWalls(that.scene);

  return that;
}
