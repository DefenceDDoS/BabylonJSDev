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
  Texture,
  CubeTexture,
  Nullable,
  Vector4,
  InstancedMesh,
  SpriteManager,
  Sprite
} from "@babylonjs/core";

// Ground

function createTerrain(scene: Scene) {
  
  const largeGroundMat = new StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new Texture(
    "./assets/environments/valleygrass.png"
  );

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "./assets/environments/villageheightmap.png",
    {
      width: 150,
      height: 150,
      subdivisions: 20,
      minHeight: 0,
      maxHeight: 10,
    },
    scene
  );
  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;
}

function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new Texture(
    "./assets/environments/villagegreen.png"
  );
  groundMaterial.diffuseTexture.hasAlpha = true;
  groundMaterial.backFaceCulling = false;
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 24, height: 24 },
    scene
  );
  ground.material = groundMaterial;
  ground.position.y = 0.01;
  return ground;
}

function createLakeArea(scene: Scene) {
  const lakeMat = new StandardMaterial("lakeMat", scene);
  const tex = new Texture("./assets/textures/water.png", scene);
  tex.hasAlpha = true;

  
  tex.uScale = 2;
  tex.vScale = 2;

  lakeMat.diffuseTexture = tex;
  lakeMat.backFaceCulling = false;

  const lake = MeshBuilder.CreateDisc(
    "lake",
    {
      radius: 3,
      tessellation: 48
    },
    scene
  );

  lake.material = lakeMat;

  
  lake.rotation.x = Math.PI / 2; 

  
  lake.position.y = 0.02;
  lake.position.x = -5;
  lake.position.z = -6;

  return lake;
}






function createHemisphericLight(scene: Scene) {
  const light = new HemisphericLight(
    "light",
    new Vector3(2, 1, 0), 
    scene
  );
  light.intensity = 0.8;
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 0.8, 0.8);
  light.groundColor = new Color3(0, 0.2, 0.7);
  return light;
}

// sky

function createSky(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture(
    "./assets/textures/skybox/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createBox(style: number) {
  
  const boxMat = new StandardMaterial("boxMat");
  const faceUV: Vector4[] = []; 
  if (style == 1) {
    boxMat.diffuseTexture = new Texture("./assets/textures/cubehouse.png");
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); 
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); 
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); 
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); 
    
  } else {
    boxMat.diffuseTexture = new Texture("./assets/textures/semihouse.png");
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); 
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); 
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0);
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); 
    
  }
  
  const box = MeshBuilder.CreateBox("box", {
    width: style,
    height: 1,
    faceUV: faceUV,
    wrap: true,
  });
  box.position = new Vector3(0, 0.5, 0);
  box.scaling = new Vector3(1, 1, 1);
  box.material = boxMat;
  return box;
}

function createRoof(style: number) {
  const roof = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.scaling.y = style * 0.85;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture("./assets/textures/roof.jpg");
  roof.material = roofMat;
  return roof;
}

function createHouse(scene: Scene, style: number) {
  const box = createBox(style);
  const roof = createRoof(style);
  const house = Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
    undefined,
    false,
    true
  );
  
  return house;
}

function createHouses(scene: Scene, style: number) {
  

  if (style == 1) {
    
    createHouse(scene, 1);
  }
  if (style == 2) {
    
    createHouse(scene, 2);
  }
  if (style == 3) {
    
    const houses: Nullable<Mesh>[] = [];
    
    houses[0] = createHouse(scene, 1);
    houses[0]!.rotation.y = -Math.PI / 16;
    houses[0]!.position.x = -6.8;
    houses[0]!.position.z = 2.5;

    houses[1] = createHouse(scene, 2);
    houses[1]!.rotation.y = -Math.PI / 16;
    houses[1]!.position.x = -4.5;
    houses[1]!.position.z = 3;

    
    const ihouses: InstancedMesh[] = [];
    const places: number[][] = [];

    
    places.push([2, -Math.PI / 16, -1.5, 4]);
    places.push([2, -Math.PI / 3,  1.5,  6]);
    places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
    places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
    places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
    places.push([1, (5 * Math.PI) / 4,   0,   -1]);
    places.push([1, Math.PI + Math.PI / 2.5,  0.5, -3]);
    places.push([2, Math.PI + Math.PI / 2.1,  0.75, -5]);
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
    places.push([2, Math.PI / 1.9,  4.75, -1]);
    places.push([1, Math.PI / 1.95, 4.5,  -3]);
    places.push([2, Math.PI / 1.9,  4.75, -5]);
    places.push([1, Math.PI / 1.9,  4.75, -7]);
    places.push([2, -Math.PI / 3,   5.25,  2]);
    places.push([1, -Math.PI / 3,   6,     4]);

    
    places.push([1, Math.PI + Math.PI / 2.3, -1.0, -9]);
    places.push([2, Math.PI + Math.PI / 2.2,  1.0, -9.5]);

    
    places.push([1, Math.PI / 1.9,  4.5,  -9]);
    places.push([2, Math.PI / 1.9,  6.2,  -6]);
    places.push([1, Math.PI / 1.9,  6.5,  -3.5]);

    
    places.push([2, -Math.PI / 16, -2.5, 6.5]);
    places.push([1, -Math.PI / 16,  0.0, 7.0]);

    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1) {
        ihouses[i] = houses[0]!.createInstance("house" + i);
      } else {
        ihouses[i] = houses[1]!.createInstance("house" + i);
      }
      ihouses[i].rotation.y = places[i][1];
      ihouses[i].position.x = places[i][2];
      ihouses[i].position.z = places[i][3];
    }
  }
}


function createTrees(scene: Scene) {
  const spriteManagerTrees = new SpriteManager(
    "treesManager",
    "./assets/sprites/tree.png",
    2000,
    { width: 512, height: 1024 },
    scene
  );

  
  const inner = 10;   
  const outer = 35;   

  for (let i = 0; i < 800; i++) {
    const tree = new Sprite("tree", spriteManagerTrees);

    let x = 0;
    let z = 0;

    
    do {
      x = (Math.random() - 0.5) * outer * 2;   
      z = (Math.random() - 0.5) * outer * 2;
    } while (Math.abs(x) < inner && Math.abs(z) < inner);

    tree.position.x = x;
    tree.position.z = z;
    tree.position.y = 0.2;
  }
}

function createClouds(scene: Scene) {
  const spriteManagerClouds = new SpriteManager(
    "cloudsManager",
    "./assets/sprites/cloud.png",   
    100,
    { width: 256, height: 256 },
    scene
  );

 
  for (let i = 0; i < 20; i++) {
    const cloud = new Sprite("cloud", spriteManagerClouds);

    
    cloud.position.x = (Math.random() - 0.5) * 40;   
    cloud.position.z = (Math.random() - 0.5) * 40;

    cloud.position.y = 12 + Math.random() * 3;        

    
    const scale = 2 + Math.random() * 2.5;            
    cloud.width = 5 * scale;
    cloud.height = 3 * scale;

  }
}

function createStatue(scene: Scene) {
  
  const statueMat = new StandardMaterial("statueMat", scene);
  const tex = new Texture("./assets/sprites/statue.png", scene);
  tex.hasAlpha = true;
  statueMat.diffuseTexture = tex;
  statueMat.backFaceCulling = false;          
  statueMat.useAlphaFromDiffuseTexture = true;

  
  const statue = MeshBuilder.CreatePlane(
    "statue",
    {
      width: 4,   
      height: 4
    },
    scene
  );

  
  statue.position = new Vector3(3, 2, 3);   

  statue.material = statueMat;

  
  statue.billboardMode = Mesh.BILLBOARDMODE_Y;

  return statue;
}



// Camera

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 25,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = 0;
  camera.upperAlphaLimit = Math.PI * 2;
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI / 2.02;

  camera.attachControl(true);
  return camera;
}

export default function createStartScene(engine: Engine) {
  const scene   = new Scene(engine);
  const ground  = createGround(scene);
  const rockArea = createLakeArea(scene);
  const sky     = createSky(scene);
  const lightHemispheric = createHemisphericLight(scene);
  const house = createHouse(scene, 1);
  createHouses(scene, 3);
  createTrees(scene);
  createTerrain(scene);
  createClouds(scene);

  
  const statue = createStatue(scene);
  

  let camera  = createArcRotateCamera(scene);

  let that: SceneData = {
    scene,
    ground,
    sky,
    lightHemispheric,
    camera
  };
  return that;
}

