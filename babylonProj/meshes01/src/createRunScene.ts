import {
    Scene,
    Mesh,
} from "@babylonjs/core";

interface SceneData {
    scene: Scene;
    box?: Mesh;
    sphere?: Mesh;
    cylinder?: Mesh;
    cone?: Mesh;
    triangle?: Mesh;
    capsule?: Mesh;
}


let angleSphere = 0;
let angleBox = 0;
let angleCylinder = 0;
let angleCone = 0;
let angleTriangle = 0;
let angleCapsule = 0;

let boxSpeed = 0.01;

export default function createRunScene(runScene: SceneData) {

    

    runScene.scene.onAfterRenderObservable.add(() => {

        
        if (runScene.sphere) {
            runScene.sphere.position.x = Math.cos(angleSphere) * 1.5 - 2;
            runScene.sphere.position.z = Math.sin(angleSphere) * 1.5;
            runScene.sphere.rotation.y += 0.03;
            angleSphere += 0.02;
        }

        
        if (runScene.box) {
            runScene.box.position.x = Math.cos(angleBox) * 2.5;
            runScene.box.position.z = Math.sin(angleBox) * 1.0;
            runScene.box.rotation.y -= 0.025;
            angleBox -= boxSpeed;
        }

        
        if (runScene.cylinder) {
            runScene.cylinder.position.x = Math.cos(angleCylinder) * 3.0 + 2;
            runScene.cylinder.position.z = Math.sin(angleCylinder) * 1.5;
            runScene.cylinder.rotation.x += 0.02;
            angleCylinder += 0.018;
        }

       
        if (runScene.cone) {
            runScene.cone.position.x = Math.cos(angleCone) * 1.2 + 1;
            runScene.cone.position.z = Math.sin(angleCone) * 1.2 - 2;
            runScene.cone.rotation.z += 0.04;
            angleCone += 0.03;
        }

       
        if (runScene.triangle) {
            runScene.triangle.position.x = Math.cos(angleTriangle) * 1.8 - 1;
            runScene.triangle.position.z = Math.sin(angleTriangle) * 1.8 - 2;
            runScene.triangle.rotation.y += 0.035;
            angleTriangle -= 0.022;
        }

        
        if (runScene.capsule) {
            runScene.capsule.position.x = Math.cos(angleCapsule) * 2.2;
            runScene.capsule.position.z = Math.sin(angleCapsule) * 2.8 + 2;
            runScene.capsule.rotation.x += 0.02;
            runScene.capsule.rotation.y += 0.015;
            angleCapsule += 0.017;
        }

    });
}
