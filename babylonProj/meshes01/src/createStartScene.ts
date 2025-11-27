import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    PointLight,
    SpotLight,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Color3,
    ShadowGenerator,
    DirectionalLight,
    Texture,
    TransformNode,
} from "@babylonjs/core";



function createHemisphericLight(scene: Scene) {
    const light: HemisphericLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    light.diffuse = new Color3(1, 1, 1);
    light.groundColor = new Color3(0.3, 0.3, 0.3);
    return light;
}

function createPointLight(scene: Scene) {
    const light = new PointLight("point", new Vector3(0, 6, 0), scene);
    light.intensity = 0.5;
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 1, 1);
    return light;
}

function createDirectionalLight(scene: Scene) {
    const light = new DirectionalLight("dir", new Vector3(-0.5, -1, -0.3), scene);
    light.position = new Vector3(10, 15, 10);
    light.intensity = 0.8;
    return light;
}

function createSpotLight(scene: Scene) {
    const light = new SpotLight(
        "spot",
        new Vector3(0, 8, -6),
        new Vector3(0, -1, 2),
        Math.PI / 3,
        20,
        scene
    );
    light.intensity = 0.6;
    return light;
}

function createLight(scene: Scene) {
    const light = new HemisphericLight("extraHemi", new Vector3(0, 1, 0), scene);
    light.intensity = 0.3;
    return light;
}



function getMaterial(scene: Scene) {
    scene.ambientColor = new Color3(1, 1, 1);

    const myMaterial = new StandardMaterial("myMaterial", scene);
    myMaterial.diffuseColor = new Color3(0.6, 0, 1);
    myMaterial.specularColor = new Color3(0.7, 0.3, 1);
    myMaterial.emissiveColor = new Color3(0.1, 0, 0.3);
    myMaterial.ambientColor = new Color3(0.3, 0, 0.5);

    return myMaterial;
}

function getMaterial1(scene: Scene) {
    const myMaterial1 = new StandardMaterial("myMaterial1", scene);
    myMaterial1.diffuseColor = new Color3(1, 1, 1);
    myMaterial1.specularColor = new Color3(0.5, 0.6, 0.87);
    myMaterial1.emissiveColor = new Color3(0, 0, 0);
    myMaterial1.ambientColor = new Color3(1, 1, 1);
    myMaterial1.diffuseTexture = new Texture("./../meshes01/assets/textures/grass.jpg", scene);
    return myMaterial1;
}

function getColorMaterial(scene: Scene, name: string, color: Color3) {
    const mat = new StandardMaterial(name, scene);
    mat.diffuseColor = color;
    return mat;
}



function createSphere(scene: Scene) {
    const sphere = MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 0.7, diameterY: 2, segments: 16 },
        scene
    );
    sphere.position.y = 1;
    return sphere;
}

function createBox(scene: Scene, myMaterial?: StandardMaterial) {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 1;
    if (myMaterial) box.material = myMaterial;
    return box;
}

function createCylinder(scene: Scene) {
    const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameter: 1, height: 2, arc: 0.5 }, scene);
    cylinder.position.y = 1;
    return cylinder;
}

function createTriangle(scene: Scene, myMaterial?: StandardMaterial) {
    const triangle = MeshBuilder.CreateCylinder(
        "triangle",
        { diameter: 1, height: 2, tessellation: 3 },
        scene
    );
    triangle.position.y = 1;
    if (myMaterial) triangle.material = myMaterial;
    return triangle;
}

function createCone(scene: Scene) {
    const cone = MeshBuilder.CreateCylinder(
        "cone",
        { diameterTop: 0, diameterBottom: 1, height: 2 },
        scene
    );
    cone.position.y = 1;
    return cone;
}

function createCapsule(scene: Scene) {
    const capsule = MeshBuilder.CreateCapsule(
        "capsule",
        { radius: 0.5, height: 2, tessellation: 3, subdivisions: 4 },
        scene
    );
    capsule.position.y = 1;
    return capsule;
}

function createGround(scene: Scene) {
    const ground = MeshBuilder.CreateGround("ground", { width: 40, height: 20 }, scene);
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.25);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    return ground;
}



function createDirectionalShadows(light: DirectionalLight, caster: Mesh, extraCaster?: Mesh) {
    const shadower = new ShadowGenerator(2048, light);
    const sm: any = shadower.getShadowMap();
    sm.renderList.push(caster);
    if (extraCaster) sm.renderList.push(extraCaster);

    shadower.setDarkness(0.4);
    shadower.useBlurExponentialShadowMap = true;
    shadower.blurScale = 2;
    shadower.bias = 0.0005;
    return shadower;
}



function createArcRotateCamera(scene: Scene) {
    const camera = new ArcRotateCamera(
        "camera1",
        -Math.PI / 2.3,
        Math.PI / 3,
        25,
        new Vector3(0, 2, 0),
        scene
    );
    camera.attachControl(true);
    return camera;
}



export default function createStartScene(engine: Engine) {

    interface SceneData {
        scene: Scene;
        box?: Mesh;
        light?: Light;
        hemi?: Light;
        point?: PointLight;
        spot?: Light;
        dlight?: DirectionalLight;
        sphere?: Mesh;
        cylinder?: Mesh;
        cone?: Mesh;
        triangle?: Mesh;
        capsule?: Mesh;
        ground?: Mesh;
        camera?: Camera;
        spinnerRoot?: TransformNode;
    }

    let that: SceneData = { scene: new Scene(engine) };

    
    const purpleMat = getMaterial(that.scene);
    const grassMat = getMaterial1(that.scene);

    const redMat = getColorMaterial(that.scene, "redMat", new Color3(1, 0.2, 0.2));
    const greenMat = getColorMaterial(that.scene, "greenMat", new Color3(0.2, 1, 0.2));
    const blueMat = getColorMaterial(that.scene, "blueMat", new Color3(0.2, 0.4, 1));
    const yellowMat = getColorMaterial(that.scene, "yellowMat", new Color3(1, 0.9, 0.2));
    const cyanMat = getColorMaterial(that.scene, "cyanMat", new Color3(0.2, 1, 1));
    const magentaMat = getColorMaterial(that.scene, "magentaMat", new Color3(1, 0.2, 1));

    
    that.hemi = createHemisphericLight(that.scene);
    that.point = createPointLight(that.scene);
    that.dlight = createDirectionalLight(that.scene);
    that.spot = createSpotLight(that.scene);
    that.light = createLight(that.scene);

    
    that.ground = createGround(that.scene);

    

    let spinnerRoot = new TransformNode("spinnerRoot", that.scene);
    spinnerRoot.position = new Vector3(-10, 0, 0);
    that.spinnerRoot = spinnerRoot;

    
    that.sphere = createSphere(that.scene);
    that.sphere.material = purpleMat;
    that.sphere.position = new Vector3(-2, 1, 0);
    that.sphere.parent = spinnerRoot;

    that.box = createBox(that.scene, purpleMat);
    that.box.position = new Vector3(0, 1, 0);
    that.box.parent = spinnerRoot;

    that.cylinder = createCylinder(that.scene);
    that.cylinder.material = purpleMat;
    that.cylinder.position = new Vector3(2, 1, 0);
    that.cylinder.parent = spinnerRoot;

    that.cone = createCone(that.scene);
    that.cone.material = purpleMat;
    that.cone.position = new Vector3(1, 1, -2);
    that.cone.parent = spinnerRoot;

    that.triangle = createTriangle(that.scene, purpleMat);
    that.triangle.position = new Vector3(-1, 1, -2);
    that.triangle.parent = spinnerRoot;

    that.capsule = createCapsule(that.scene);
    that.capsule.material = purpleMat;
    that.capsule.position = new Vector3(0, 1, 2);
    that.capsule.parent = spinnerRoot;

    

    let colorOffsetX = 0;

    let colorSphere = createSphere(that.scene);
    colorSphere.material = redMat;
    colorSphere.position = new Vector3(colorOffsetX - 2, 1, -3);

    let colorBox = createBox(that.scene, greenMat);
    colorBox.position = new Vector3(colorOffsetX, 1, -3);

    let colorCylinder = createCylinder(that.scene);
    colorCylinder.material = blueMat;
    colorCylinder.position = new Vector3(colorOffsetX + 2, 1, -3);

    let colorCone = createCone(that.scene);
    colorCone.material = yellowMat;
    colorCone.position = new Vector3(colorOffsetX - 1, 1, -5);

    let colorTriangle = createTriangle(that.scene, cyanMat);
    colorTriangle.position = new Vector3(colorOffsetX + 1, 1, -5);

    let colorCapsule = createCapsule(that.scene);
    colorCapsule.material = magentaMat;
    colorCapsule.position = new Vector3(colorOffsetX, 1, -1);

    

    let shadowBox = createBox(that.scene, grassMat);
    shadowBox.position = new Vector3(10, 1, 0);

    let shadowSphere = MeshBuilder.CreateSphere("shadowSphere", { diameter: 1.2 }, that.scene);
    shadowSphere.material = purpleMat;
    shadowSphere.position = new Vector3(11.5, 1.2, 0);
    shadowSphere.receiveShadows = true;

    if (that.ground) {
        that.ground.receiveShadows = true;
    }

    createDirectionalShadows(that.dlight as DirectionalLight, shadowBox, shadowSphere);

    
    that.camera = createArcRotateCamera(that.scene);

    return that;
}
