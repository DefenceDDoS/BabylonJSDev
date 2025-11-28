import "@babylonjs/loaders/glTF/2.0";

import {
  Scene,
  Vector3,
  MeshBuilder,
  PhysicsCharacterController,
  Quaternion,
  CharacterSupportedState,
  KeyboardEventTypes,
  StandardMaterial,
  Color3,
  ArcRotateCamera,              // ← добавили
} from "@babylonjs/core";

export function createCharacterController(scene: Scene) {
  // Character state machine
  let characterState = "ON_GROUND";
  const inAirSpeed = 8.0;
  const onGroundSpeed = 10;
  const jumpHeight = 1.5;
  const characterGravity = new Vector3(0, -18, 0);

  // Input tracking
  let keyInput = new Vector3(0, 0, 0); // x = left/right, z = forward/back
  let wantJump = false;

  // Character orientation (оставим, если захочешь крутить модель)
  let characterOrientation = Quaternion.Identity();
  let forwardLocalSpace = new Vector3(0, 0, 1);

  // Create visual capsule mesh
  const h = 1.8;
  const r = 0.6;
  let displayCapsule = MeshBuilder.CreateCapsule(
    "CharacterDisplay",
    { height: h, radius: r },
    scene
  );
  displayCapsule.position = new Vector3(0, h / 2, 0);

  // Camera follows capsule
  const cam = scene.activeCamera as ArcRotateCamera | null;
  if (cam) {
    cam.lockedTarget = displayCapsule;
    cam.radius = 15;
    cam.beta = Math.PI / 3;
  }

  // Apply material for visibility
  const capsuleMat = new StandardMaterial("capsuleMat", scene);
  capsuleMat.diffuseColor = new Color3(0.8, 0.2, 0.2);
  capsuleMat.emissiveColor = new Color3(0.3, 0.1, 0.1);
  displayCapsule.material = capsuleMat;

  console.log("Capsule initial position:", displayCapsule.position);

  // Create physics character controller
  let characterController = new PhysicsCharacterController(
    displayCapsule.position.clone(),
    { capsuleHeight: h, capsuleRadius: r },
    scene
  );

  // --- helper: движение относительно камеры ---
  function buildDesiredVelocityFromCamera(
    speed: number,
    upWorld: Vector3,
    forwardWorld: Vector3
  ): Vector3 {
    // forwardWorld уже нормализован и лежит в XZ
    const rightWorld = Vector3.Cross(upWorld, forwardWorld).normalize();

    // z — вперёд/назад, x — влево/вправо
    let move = forwardWorld.scale(keyInput.z).add(rightWorld.scale(keyInput.x));

    if (move.lengthSquared() < 1e-6) return Vector3.Zero();
    move.normalize();
    move.scaleInPlace(speed);
    return move;
  }

  // Compute desired velocity based on input and state
  const getDesiredVelocity = function (
    deltaTime: number,
    supportInfo: {
      supportedState: CharacterSupportedState;
      averageSurfaceNormal: Vector3;
      averageSurfaceVelocity: Vector3;
    },
    currentVelocity: Vector3
  ): Vector3 {
    // State transitions
    if (
      characterState === "ON_GROUND" &&
      supportInfo.supportedState !== CharacterSupportedState.SUPPORTED
    ) {
      characterState = "IN_AIR";
    } else if (
      characterState === "IN_AIR" &&
      supportInfo.supportedState === CharacterSupportedState.SUPPORTED
    ) {
      characterState = "ON_GROUND";
    }

    if (characterState === "ON_GROUND" && wantJump) {
      characterState = "START_JUMP";
    } else if (characterState === "START_JUMP") {
      characterState = "IN_AIR";
    }

    let upWorld = characterGravity.normalizeToNew();
    upWorld.scaleInPlace(-1.0);

    // forwardWorld: либо по камере, либо как раньше
    let forwardWorld: Vector3;
    if (cam) {
      forwardWorld = cam.getDirection(new Vector3(0, 0, 1));
      forwardWorld.y = 0;
      if (forwardWorld.lengthSquared() < 1e-6) {
        forwardWorld = new Vector3(0, 0, 1);
      }
      forwardWorld.normalize();
    } else {
      forwardWorld = forwardLocalSpace.applyRotationQuaternion(
        characterOrientation
      );
    }

    if (characterState === "IN_AIR") {
      const desiredVelocity = cam
        ? buildDesiredVelocityFromCamera(inAirSpeed, upWorld, forwardWorld)
        : keyInput
            .scale(inAirSpeed)
            .applyRotationQuaternion(characterOrientation);

      let outputVelocity = characterController.calculateMovement(
        deltaTime,
        forwardWorld,
        upWorld,
        currentVelocity,
        Vector3.ZeroReadOnly,
        desiredVelocity,
        upWorld
      );
      // Restore vertical component and apply gravity
      outputVelocity.addInPlace(upWorld.scale(-outputVelocity.dot(upWorld)));
      outputVelocity.addInPlace(upWorld.scale(currentVelocity.dot(upWorld)));
      outputVelocity.addInPlace(characterGravity.scale(deltaTime));
      return outputVelocity;
    } else if (characterState === "ON_GROUND") {
      const desiredVelocity = cam
        ? buildDesiredVelocityFromCamera(onGroundSpeed, upWorld, forwardWorld)
        : keyInput
            .scale(onGroundSpeed)
            .applyRotationQuaternion(characterOrientation);

      let outputVelocity = characterController.calculateMovement(
        deltaTime,
        forwardWorld,
        supportInfo.averageSurfaceNormal,
        currentVelocity,
        supportInfo.averageSurfaceVelocity,
        desiredVelocity,
        upWorld
      );
      // Project velocity onto ground plane
      outputVelocity.subtractInPlace(supportInfo.averageSurfaceVelocity);
      let inv1k = 1e-3;
      if (outputVelocity.dot(upWorld) > inv1k) {
        let velLen = outputVelocity.length();
        outputVelocity.normalizeFromLength(velLen);
        let horizLen = velLen / supportInfo.averageSurfaceNormal.dot(upWorld);
        let c = supportInfo.averageSurfaceNormal.cross(outputVelocity);
        outputVelocity = c.cross(upWorld);
        outputVelocity.scaleInPlace(horizLen);
      }
      outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
      return outputVelocity;
    } else if (characterState === "START_JUMP") {
      let u = Math.sqrt(2 * characterGravity.length() * jumpHeight);
      let curRelVel = currentVelocity.dot(upWorld);
      return currentVelocity.add(upWorld.scale(u - curRelVel));
    }
    return Vector3.Zero();
  };

  // Sync visual mesh with physics controller every frame
  scene.onBeforeRenderObservable.add(() => {
    displayCapsule.position.copyFrom(characterController.getPosition());
  });

  // Update physics each frame
  scene.onAfterPhysicsObservable?.add(() => {
    if (scene.deltaTime === undefined) return;
    let dt = scene.deltaTime / 1000.0;
    if (dt === 0) return;

    let down = new Vector3(0, -1, 0);
    let support = characterController.checkSupport(dt, down);

    let desiredLinearVelocity = getDesiredVelocity(
      dt,
      support,
      characterController.getVelocity()
    );
    characterController.setVelocity(desiredLinearVelocity);
    characterController.integrate(dt, support, characterGravity);
  });

  // Keyboard input handler
  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key;

    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        if (key === "w" || key === "ArrowUp") {
          keyInput.z = 1;
        } else if (key === "s" || key === "ArrowDown") {
          keyInput.z = -1;
        } else if (key === "a" || key === "ArrowLeft") {
          keyInput.x = -1;
        } else if (key === "d" || key === "ArrowRight") {
          keyInput.x = 1;
        } else if (key === " ") {
          wantJump = true;
        }
        break;

      case KeyboardEventTypes.KEYUP:
        if (
          key === "w" ||
          key === "s" ||
          key === "ArrowUp" ||
          key === "ArrowDown"
        ) {
          keyInput.z = 0;
        }
        if (
          key === "a" ||
          key === "d" ||
          key === "ArrowLeft" ||
          key === "ArrowRight"
        ) {
          keyInput.x = 0;
        }
        if (key === " ") {
          wantJump = false;
        }
        break;
    }
  });
}
