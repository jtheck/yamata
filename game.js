


// YAMATA SPIN
// Boss Rush Jam 2025


const 
Vec3 = BABYLON.Vector3,
ColorHex = BABYLON.Color3.FromHexString,

log = console.log
;

let canvas, engine, scene, camera, light;

let ground, player, players, boss;

let keyState = {
  left: false,
  right: false,
  up: false,
  down: false
};

function init(){
  canvas = document.getElementById('canvas');
  engine = new BABYLON.Engine(canvas, false, null, false); // BABYLON
  scene = new BABYLON.Scene(engine);

  makeScene();
  
}
async function netInit(){
  // const { onPlayerJoin, insertCoin, isHost, myPlayer } = Playroom;
  await Playroom.insertCoin();
  // Create the plane(s) when the player joins.
  Playroom.onPlayerJoin((player) => {
    console.log(`${player.getProfile().name} joined the game`);
    log(player.getProfile())
    // const plane = createPlane(state.getProfile().color.hex);
    // players.push({ state, plane });
    // // Remove the plane when the player leaves.
    // state.onQuit(() => {
    //   scene.remove(plane.mesh);
    //   players = players.filter((p) => p.state != state);
    // });
  });
}
function resize(){
  engine.resize();
}

function keyInput(e){
  let state = e.type == 'keydown' ? true : false;
  // log(e.code)

  let prevKeyState = keyState;

  // if (!state) return;

  switch(e.code){
    case 'Space':
      keyState.up = state;

      player.node.position.y += .5;
    break;
    case 'ShiftLeft':
    case 'ShiftRight':

      player.node.position.y -= .5;
    break;
    case 'KeyW':
    case 'ArrowUp': 
    
      // Playroom.myPlayer().setState("dir", 'boop');

    break;
    case 'KeyA':
    case 'ArrowLeft':
      keyState.left = state;

    break;
    case 'KeyS':
    case 'ArrowDown':
      keyState.down = state;

      // log(e)
    break;
    case 'KeyD':
    case 'ArrowRight':
      keyState.right = state;


    break;
  }


}
function procInput(){
  
  if (keyState.left){
    player.pb.imp -= .5;

  }
  if (keyState.right){
    player.pb.imp += .5;

  }
  
  
  // keyState = {
  //   left: false,
  //   right: false,
  //   up: false,
  //   down: false
  // }
}

player = {
 pb: new PBody(),
 node: null
}



function makeScene(){
  // scene.autoClear = false; // Preserve background
  // scene.clearColor = ColorHex("#ffffff");
  
  makeCamera();
  light = new BABYLON.DirectionalLight("DirectionalLight", new Vec3(-.5, -1, -1.25), scene);
  light.intensity = 0.69;


  ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 8, height: 8}, scene);


  let pyramid = makePyramid({loc:new Vec3()},scene);
  // pyramid.material
  // log(pyramid)


  boss = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 32}, scene);
  boss.position.y = 1;

  player.node = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: .5, segments: 32}, scene);


  // // Create & launch a particule system
  // var particleSystem = new BABYLON.ParticleSystem("spawnParticles", 3600, scene);    // 3600 particles to have a continue effect when computing circle positions
  // particleSystem.particleTexture = new BABYLON.Texture("assets/particles/flare.png", scene);
  // particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, .25);
  // particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, .25);
  // particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
  // particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);//.add(tr.self.frame);
  // particleSystem.minSize = 0.1;
  // particleSystem.maxSize = 0.5;
  // particleSystem.emitRate = 500;
  // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;     // to manage alpha
  // //  particleSystem.gravity = new BABYLON.Vector3(0, 3, 0);
  // //particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
  // //particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
  // particleSystem.minEmitPower = 5;
  // particleSystem.maxEmitPower = 50;
  // //particleSystem.updateSpeed = 0.1;
  // particleSystem.cpt = 0; // Number of particles
  // // Custom function to get the circle effect
  // particleSystem.startPositionFunction = function(worldMatrix, positionToUpdate)
  // {
  //     var randX = -Math.sin(this.cpt * Math.PI/180);
  //     var randY = this.minEmitBox.y+1.5;
  //     var randZ = Math.cos(this.cpt * Math.PI/180);
  //     BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
  //     this.cpt++;
  // }
  // // Start
  // particleSystem.start();
}


function makeCamera(){
  // camera = new BABYLON.ArcRotateCamera("MainCamera", -2.5, 1.25, 10, new Vec3(0, 0, 0), scene);
    camera = new BABYLON.UniversalCamera("MainCamera", new BABYLON.Vector3(0, 3, 0), scene);

  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  // camera.inputs.attached.keyboard.detachControl();

  camera.fov = 1;
}







const tickrate = 30; // Desired tick rate per second
const timestep = 1000 / tickrate; // Fixed time step (in milliseconds)
let lastFrameTime = performance.now();
let frameTime = 0;
let currentTime = 0;
let stepLag = 0;
let frameAlpha = 0;
let accumulatedTime = 0;
function run(){

  engine.runRenderLoop(()=>{
    currentTime = performance.now();
    frameTime = currentTime - lastFrameTime;
    if (frameTime > 250) // frame panic
      frameTime = 250;
    lastFrameTime = currentTime;
    accumulatedTime += frameTime;
    stepLag = 0;

    while (accumulatedTime >= timestep) {
      update(timestep, currentTime);

      accumulatedTime -= timestep;
    
      stepLag += 1;
      if (stepLag >= 15) // integrator panic
        accumulatedTime = 0;
    }

    frameAlpha = accumulatedTime / timestep;

    render(frameAlpha, 1-frameAlpha)
  });
}

function update(dt, t){
  // let x = Math.cos(x);
  // let z = Math.sin(z);
  procInput();
  player.pb.integrate(1/dt);

}

function render(a, b){
  let spin = player.pb.interpolate(a,b).spin;

  player.node.position.x = 4*Math.cos(spin);
  player.node.position.z = 4*Math.sin(spin);

  camera.position.x = 8*Math.cos(spin);
  camera.position.z = 8*Math.sin(spin);
  camera.setTarget(Vec3.Zero());

  scene.render();
}




function PBody(){
  this.mass = 200;
  this.friction = -.02;

  this.imp = 0;
  
  this.acc = 0;

  this.vel = 0;
  
  this.state = {
    loc: new Vec3(),
    spin: 0,
    level: 0
  }
  this.prevState = {
    loc: new Vec3(),
    spin: 0,
    level:0
  }
}
PBody.prototype.interpolate = function(a, b){
  return {
    spin: this.state.spin*a+this.prevState.spin*b
  }
}
PBody.prototype.integrate = function(dt){
  // save state
  this.prevState.loc = this.state.loc.clone();
  this.prevState.spin = this.state.spin;



  let rebound = Math.abs(this.state.spin) / 10;
  

  // imp -> acc
  this.imp+=(this.vel * this.friction);
  this.acc = this.imp*this.mass;
  
  this.imp=0;
  
  this.vel+=(this.acc*dt);
  this.state.spin += this.vel*dt;

  let ZEROVELOCITY = .01;
}



makePyramid = function(obj, scene) {
  var loc = new Vec3();
  var h = obj.height || 2;
  var name = "Pyramid";
  name = "Wire_" + name;

  var pyramidFaces = [
    0, 1, 5,
    1, 2, 5,
    2, 3, 5,
    3, 4, 5,
    4, 0, 5
  ]
  
  var pyramid = new BABYLON.Mesh(name, scene);
  var vertexData = new BABYLON.VertexData();

  var pyramidVerts = [];//obj.verts;
  for (var i=0; i<360; i+=72){
      pyramidVerts.push(loc.x+h*Math.cos(i*Math.PI/180));
      pyramidVerts.push(loc.y+0);
      pyramidVerts.push(loc.z+h*Math.sin(i*Math.PI/180));
  }

  var sideLength = Math.sqrt(((pyramidVerts[3]-pyramidVerts[0])*(pyramidVerts[3]-pyramidVerts[0]))+(pyramidVerts[5]-pyramidVerts[2])*((pyramidVerts[5]-pyramidVerts[2])));
  pyramidVerts.push(loc.x+0);
  pyramidVerts.push(loc.y+Math.sqrt((5-Math.sqrt(5))/10)*sideLength);
  pyramidVerts.push(loc.z+0);
  
  vertexData.positions = pyramidVerts;
  vertexData.indices = pyramidFaces;
  vertexData.normals = [];
  BABYLON.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
  vertexData.applyToMesh(pyramid);

  return pyramid;
};