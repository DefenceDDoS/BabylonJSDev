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
    
} from "@babylonjs/core";

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
}