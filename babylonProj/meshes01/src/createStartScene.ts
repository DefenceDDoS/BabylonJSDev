//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
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
  } from "@babylonjs/core";
  
    function createSphere(scene: Scene) {
    const sphere = MeshBuilder.CreateSphere(
      "ellipsoid",
      { diameter: 0.7, diameterY: 2, segments: 16 },
      scene,
    );
    sphere.position.x = 0;
    sphere.position.y = 1;
    return sphere;
  }

  function createBox(scene: Scene) {
    const box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.x = 3;
    box.position.y = 1;
    return box;
  }

  function createCylinder(scene: Scene){
    const cylinder = MeshBuilder.CreateCylinder("cylinder",{diameter: 1, height:2, arc: 0.5}, scene)
    cylinder.position.x = 5;
    cylinder.position.y = 1;
    return cylinder;
  }

    function createTriangle(scene: Scene){
    const triangle = MeshBuilder.CreateCylinder("triangle",{diameter: 1, height:2, tessellation: 3}, scene)
    triangle.position.x = 9;
    triangle.position.y = 1;
    return triangle;
  }

    function createCone(scene: Scene){
    const cone = MeshBuilder.CreateCylinder("cone",{diameterTop:0, diameterBottom: 1, height: 2}, scene)
    cone.position.x = 7;
    cone.position.y = 1;
    return cone;
  }

      function createCapsule(scene: Scene){
    const capsule = MeshBuilder.CreateCapsule("capsule",{radius: 0.5, height: 2, tessellation: 3, subdivisions: 4}, scene)
    capsule.position.x = -3;
    capsule.position.y = 1;
    return capsule;
  }
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene,
    );
    return ground;
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      light?: Light;
      sphere?: Mesh;
      cylinder?: Mesh;
      cone?: Mesh;
      triangle?: Mesh;
      capsule?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    
  
    that.box = createBox(that.scene);
    that.light = createLight(that.scene);
    that.sphere = createSphere(that.scene);
    that.cylinder = createCylinder(that.scene);
    that.cone = createCone(that.scene);
    that.triangle = createTriangle(that.scene);
    that.capsule = createCapsule(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
