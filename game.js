


// YAMATA SPIN
// Boss Rush Jam 2025

const { onPlayerJoin, insertCoin, isHost, myPlayer } = Playroom;

const 
  Vec3 = BABYLON.Vector3,
  ColorHex = BABYLON.Color3.FromHexString,

  log = console.log
;

let canvas, engine, scene, camera, light;

let ground;


function init(){
  canvas = document.getElementById('canvas');
  engine = new BABYLON.Engine(canvas, false, null, false); // BABYLON
  scene = new BABYLON.Scene(engine);
  scene.autoClear = false; // Preserve background
  // scene.clearColor = ColorHex("#ffffff");

  makeScene();

}

function resize(){
  engine.resize();
}



function makeScene(){
  makeCamera();
  light = new BABYLON.DirectionalLight("DirectionalLight", new Vec3(-.5, -1, -1.25), scene);
  light.intensity = 0.7;


  ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

}


function makeCamera(){
  camera = new BABYLON.ArcRotateCamera("MainCamera", -2.5, 1.25, 10, new Vec3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

}

function run(){

  engine.runRenderLoop(()=>{

    scene.render()
  });
}