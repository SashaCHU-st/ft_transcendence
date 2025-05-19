// client/src/pong/scene.ts
import * as BABYLON from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export let scene: BABYLON.Scene | null = null;
export let camera: BABYLON.ArcRotateCamera | null = null;
export let leftPaddle: BABYLON.Mesh | null = null;
export let rightPaddle: BABYLON.Mesh | null = null;
export let ball: BABYLON.Mesh | null = null;

interface GameState {
  FIELD_WIDTH: number;
  FIELD_HEIGHT: number;
}

export function createScene(
  engine: BABYLON.Engine,
  canvas: HTMLCanvasElement,
  config: GameState,
) {
  const s = new BABYLON.Scene(engine);
  scene = s;

  const c = new BABYLON.ArcRotateCamera(
    "arcCamera",
    0,
    1.2,
    30,
    BABYLON.Vector3.Zero(),
    s,
  );
  camera = c;
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
    s,
  ).intensity = 0.8;

  const pipe = new BABYLON.DefaultRenderingPipeline("pipe", true, s, [c]);
  pipe.bloomEnabled = true;
  pipe.bloomThreshold = 0.3;
  pipe.bloomWeight = 0.2;
  pipe.chromaticAberrationEnabled = true;
  pipe.chromaticAberration.aberrationAmount = 2;

  // skybox
  const sky = BABYLON.MeshBuilder.CreateBox("sky", { size: 1000 }, s);
  const skyMat = new BABYLON.StandardMaterial("skyMat", s);
  skyMat.backFaceCulling = false;
  skyMat.reflectionTexture = new BABYLON.CubeTexture(
    "https://assets.babylonjs.com/environments/space",
    s,
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
    s,
  );
  const gmat = new GridMaterial("gridMat", s);
  gmat.mainColor = new BABYLON.Color3(0, 0, 0);
  gmat.lineColor = new BABYLON.Color3(0.2, 1, 0.8);
  gmat.opacity = 0.85;
  ground.material = gmat;

  // paddles
  const paddleSize = { width: 1, height: 0.5, depth: 3 };
  leftPaddle = BABYLON.MeshBuilder.CreateBox("pL", paddleSize, s);
  rightPaddle = BABYLON.MeshBuilder.CreateBox("pR", paddleSize, s);
  if (leftPaddle) {
    leftPaddle.position.set(-config.FIELD_WIDTH + 1.5, 0.5, 0);
    leftPaddle.material = neonMat(s, 0.8, 0.2, 0.8);
  }
  if (rightPaddle) {
    rightPaddle.position.set(config.FIELD_WIDTH - 1.5, 0.5, 0);
    rightPaddle.material = neonMat(s, 0.2, 0.8, 0.7);
  }

  // ball
  const b = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 1 }, s);
  ball = b;
  ball.position.set(0, 0.5, 0);
  ball.material = neonMat(s, 0.8, 0.8, 0.2);

  // trail
  const trail = new BABYLON.ParticleSystem("trail", 1000, s);
  trail.particleTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/textures/flare.png",
    s,
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

  new BABYLON.GlowLayer("glow", s, {
    mainTextureFixedSize: 512,
    blurKernelSize: 32,
  }).intensity = 0.2;

  s.executeWhenReady(() => {
    fitFieldToCamera(config.FIELD_WIDTH, config.FIELD_HEIGHT);
  });
}

export function fitFieldToCamera(FW: number, FH: number) {
  if (!camera || !camera.framingBehavior) return;
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

export function boom(pos: BABYLON.Vector3) {
  if (!scene) return;
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
