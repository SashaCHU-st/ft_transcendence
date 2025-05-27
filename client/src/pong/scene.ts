// client/src/pong/scene.ts
import * as BABYLON from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";
import type { PhysicsParams } from "./types";

export interface SceneObjects {
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera;
  leftPaddle: BABYLON.Mesh;
  rightPaddle: BABYLON.Mesh;
  ball: BABYLON.Mesh;
}

type Config = PhysicsParams;

export function createScene(
  engine: BABYLON.Engine,
  canvas: HTMLCanvasElement,
  config: Config,
): SceneObjects {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    "arcCamera",
    0,
    1.2,
    30,
    BABYLON.Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, true);

  camera.keysUp = [];
  camera.keysDown = [];
  camera.keysLeft = [];
  camera.keysRight = [];
  camera.lowerBetaLimit = 0.3;
  camera.upperBetaLimit = Math.PI / 2;
  camera.useFramingBehavior = true;
  if (camera.framingBehavior) {
    camera.framingBehavior.elevationReturnTime = -1;
  }

  new BABYLON.HemisphericLight(
    "hemi",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  ).intensity = 0.8;

  const pipe = new BABYLON.DefaultRenderingPipeline("pipe", true, scene, [
    camera,
  ]);
  pipe.bloomEnabled = true;
  pipe.bloomThreshold = 0.3;
  pipe.bloomWeight = 0.2;
  pipe.chromaticAberrationEnabled = true;
  pipe.chromaticAberration.aberrationAmount = 2;

  // skybox
  const sky = BABYLON.MeshBuilder.CreateBox("sky", { size: 1000 }, scene);
  const skyMat = new BABYLON.StandardMaterial("skyMat", scene);
  skyMat.backFaceCulling = false;
  skyMat.reflectionTexture = new BABYLON.CubeTexture(
    "https://assets.babylonjs.com/environments/space",
    scene,
  );
  skyMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyMat.specularColor = new BABYLON.Color3(0, 0, 0);
  sky.material = skyMat;

  // ground
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    {
      width: config.FIELD_WIDTH * 2,
      height: config.FIELD_HEIGHT * 2,
    },
    scene,
  );
  const gmat = new GridMaterial("gridMat", scene);
  gmat.mainColor = new BABYLON.Color3(0, 0, 0);
  gmat.lineColor = new BABYLON.Color3(0.2, 1, 0.8);
  gmat.opacity = 0.85;
  ground.material = gmat;

  // paddles
  const paddleSize = { width: 1, height: 0.5, depth: 3 };
  const leftPaddle = BABYLON.MeshBuilder.CreateBox("pL", paddleSize, scene);
  const rightPaddle = BABYLON.MeshBuilder.CreateBox("pR", paddleSize, scene);
  leftPaddle.position.set(-config.FIELD_WIDTH + 1.5, 0.5, 0);
  leftPaddle.material = neonMat(scene, 0.8, 0.2, 0.8);
  rightPaddle.position.set(config.FIELD_WIDTH - 1.5, 0.5, 0);
  rightPaddle.material = neonMat(scene, 0.2, 0.8, 0.7);

  // ball
  const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
  ball.position.set(0, 0.5, 0);
  ball.material = neonMat(scene, 0.8, 0.8, 0.2);

  // trail
  const trail = new BABYLON.ParticleSystem("trail", 1000, scene);
  trail.particleTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/textures/flare.png",
    scene,
  );
  trail.emitter = ball;
  trail.minEmitBox = trail.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
  trail.color1 = new BABYLON.Color4(0.2, 1, 0.8, 1);
  trail.color2 = new BABYLON.Color4(0.2, 1, 0.8, 0.5);
  trail.colorDead = new BABYLON.Color4(0, 0, 0, 0);
  trail.minSize = 0.2;
  trail.maxSize = 0.5;
  trail.minLifeTime = 0.3;
  trail.maxLifeTime = 0.6;
  trail.emitRate = 60;
  trail.updateSpeed = 0.02;
  trail.start();

  new BABYLON.GlowLayer("glow", scene, {
    mainTextureFixedSize: 512,
    blurKernelSize: 32,
  }).intensity = 0.2;

  scene.executeWhenReady(() => {
    fitFieldToCamera(camera, config.FIELD_WIDTH, config.FIELD_HEIGHT);
  });

  return { scene, camera, leftPaddle, rightPaddle, ball };
}

export function fitFieldToCamera(
  camera: BABYLON.ArcRotateCamera,
  FW: number,
  FH: number,
) {
  if (!camera.framingBehavior) return;
  camera.alpha = -Math.PI / 2;
  const min = new BABYLON.Vector3(-FH, 0, -FW);
  const max = new BABYLON.Vector3(FH, 2, FW);
  camera.framingBehavior.zoomOnBoundingInfo(min, max);
}

export function neonMat(s: BABYLON.Scene, r: number, g: number, b: number) {
  const m = new BABYLON.StandardMaterial("m", s);
  m.diffuseColor = new BABYLON.Color3(0, 0, 0);
  m.emissiveColor = new BABYLON.Color3(r, g, b);
  return m;
}

export function boom(scene: BABYLON.Scene, pos: BABYLON.Vector3) {
  const ex = new BABYLON.ParticleSystem("boom", 50, scene);
  ex.particleTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/textures/flare.png",
    scene,
  );
  ex.emitter = pos.clone();
  ex.minEmitBox = ex.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
  ex.color1 = new BABYLON.Color4(1, 0.6, 0, 1);
  ex.color2 = new BABYLON.Color4(1, 1, 0, 1);
  ex.colorDead = new BABYLON.Color4(0, 0, 0, 0);
  ex.minSize = 0.1;
  ex.maxSize = 0.5;
  ex.minLifeTime = 0.2;
  ex.maxLifeTime = 0.4;
  ex.emitRate = 100;
  ex.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  ex.gravity = new BABYLON.Vector3(0, -2, 0);
  ex.direction1 = new BABYLON.Vector3(-1, 1, -1);
  ex.direction2 = new BABYLON.Vector3(1, 1, 1);
  ex.minEmitPower = 1;
  ex.maxEmitPower = 2;
  ex.targetStopDuration = 0.2;
  ex.disposeOnStop = true;
  ex.start();
}

export function bigBoom(scene: BABYLON.Scene, pos: BABYLON.Vector3) {
  const ex = new BABYLON.ParticleSystem("bigBoom", 150, scene);
  ex.particleTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/textures/flare.png",
    scene,
  );
  ex.emitter = pos.clone();
  ex.minEmitBox = ex.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
  ex.color1 = new BABYLON.Color4(1, 0.6, 0, 1);
  ex.color2 = new BABYLON.Color4(1, 1, 0, 1);
  ex.colorDead = new BABYLON.Color4(0, 0, 0, 0);
  ex.minSize = 0.3;
  ex.maxSize = 0.8;
  ex.minLifeTime = 0.1;
  ex.maxLifeTime = 0.2;
  ex.emitRate = 200;
  ex.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  ex.gravity = new BABYLON.Vector3(0, -2, 0);
  ex.direction1 = new BABYLON.Vector3(-1, 1, -1);
  ex.direction2 = new BABYLON.Vector3(1, 1, 1);
  ex.minEmitPower = 2;
  ex.maxEmitPower = 3;
  ex.targetStopDuration = 0.1;
  ex.disposeOnStop = true;
  ex.start();
}
