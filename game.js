


// YAMATA SPIN
// Boss Rush Jam 2025


const 
Vec3 = BABYLON.Vector3,
ColorHex = BABYLON.Color3.FromHexString,

ASS = 'assets/', // remove to deploy
log = console.log
;

let canvas, engine, scene, camera, lightD, lightP, lightH;
let board;
let ground, player, players, boss;
let life;
let rolley;
let bushes, rocks;
let keyState = {
  left: false,
  right: false,
  up: false,
  down: false
};
let notice = false;
let jumpStop = 0;
let jumpTrigger = false;
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
async function load(){
  await BABYLON.InitializeCSG2Async();
  let pyramid = makePyramid(12.4,scene);
  // pyramid.position = new Vec3(-17,0,0)
// log(pyramid)
  const skullCSG = BABYLON.CSG2.FromMesh(pyramid, true);

  let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 7, segments: 13}, scene);
  sphere.position.y = 5;
  sphere.setEnabled(false);

  sphere.setVerticesData(BABYLON.VertexBuffer.UVKind, null); // match properties accounts
  const sphereCSG = BABYLON.CSG2.FromMesh(sphere);

  board = skullCSG.subtract(sphereCSG).toMesh("Board");
  board.position.x = 1;
  board.position.z = 0;
  let mat = new BABYLON.StandardMaterial(name, scene);
  mat.specularColor = new BABYLON.Color3(0.07, 0.07, 0.07);

  mat.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
  // mat.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

  board.material = mat;

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
    break;
    case 'ShiftLeft':
    case 'ShiftRight':
      keyState.boost = state;
    break;
    case 'KeyW':
    case 'KeyE':
    case 'ArrowUp': 
      keyState.in = state;
    break;
    case 'KeyA':
    case 'KeyS':
    case 'ArrowLeft':
      keyState.left = state;
    break;
    case 'ArrowDown':
      keyState.down = state;
    break;
    case 'KeyD':
    case 'KeyF':
    case 'ArrowRight':
      keyState.right = state;
    break;
  }


}
function procInput(){
  let impulse = 1.5;

  if (keyState.left){
    player.pb.sImp.x -= impulse;
  }
  if (keyState.right){
    player.pb.sImp.x += impulse;
  }
  if (keyState.boost){
    player.pb.sImp.x *= 2;
    if (jumpStop>0)jumpStop--;
  }
  if (keyState.up){
    // makeBoop('boing');
    player.pb.sImp.y += impulse*2;

  } 
  if (keyState.in){
    if (player.pb.sVel.z <=0 && player.pb.sImp.z <=0)
    player.pb.sImp.z -= impulse*33;
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








let mat;

let triangle;
function makeScene(){
  scene.autoClear = false; // Preserve background
  // scene.clearColor = ColorHex("#ffffff");
  
  // lights
  lightD = new BABYLON.DirectionalLight("DirectionalLight", new Vec3(-.5, -1, -1.25), scene);
  lightD.intensity = 0.6;
  
  lightP = new BABYLON.PointLight("*PointLight0", new BABYLON.Vector3(0, -4, 0), scene);
  lightP.intensity = .88;
  // lightP.diffuse = new BABYLON.Color3(.9, .9, .9);
  // lightP.specular = new BABYLON.Color3(.9,.9,.9);
  // lightP.range = 25;
  // lightP.radius = 1;
  
  // Hemispheric Light (luna)
  var direction = new Vec3(2, .44, 3.67).negate(); // gfx.lunaPos
  lightH = new BABYLON.HemisphericLight("*HemisphericLight", direction, scene);
  lightH.intensity = .5; // 1 minimum
  // lightH.diffuse = new BABYLON.Color3(.8, 0.8, .9);
  // lightH.specular = new BABYLON.Color3(.7,.7,.63);
  // lightH.groundColor = new BABYLON.Color3(0, 0, 0);
  
bushes = new BABYLON.TransformNode();
rocks = new BABYLON.TransformNode();

  makeCamera();

  makeAtmo();

  makeBoard();

  makeGUI();

  

  frog = BABYLON.MeshBuilder.CreateSphere("boss", {diameter: 1.5, segments: 32}, scene);
  frog.isVisible = false;
  boss.node = frog;


  player.node = BABYLON.MeshBuilder.CreateSphere("player", {diameter: .5, segments: 32}, scene);
  player.node.setEnabled(false);

  BABYLON.SceneLoader.ImportMeshAsync(null, '', ASS+"isopod.glb", scene).then(function (result) {
    rolley = result.meshes[0];//.createInstance()
    rolley.scaling = new Vec3(-.5,.5,.5)
    // log(rolley)
    player.node = null;
    player.node = rolley;
    player.node.scaling = new Vec3(.35,.35,.35);
    player.node.position.y = -2;
  });
  BABYLON.SceneLoader.ImportMeshAsync(null, '', ASS+"frog.glb", scene).then(function (result) {
    bosses[0].node = result.meshes[0];//frog;
    bosses[0].main = bosses[0].node._children[0];
    // bosses[0].node._children[0].isVisible = false;

    // log(bosses[0].node)
    // bosses[0].node._children[0].isVisible = false;
  });
  BABYLON.SceneLoader.ImportMeshAsync(null, '', ASS+"san.glb", scene).then(function (result) {
    bosses[1].node = result.meshes[0];//frog;
    bosses[1].main = bosses[1].node._children[0];
    // bosses[1].node.isVisible = false;
    bosses[1].node._children[0].isVisible = false;

    boss.scaling = new Vec3(-6,6,6)
  });
  BABYLON.SceneLoader.ImportMeshAsync(null, '', ASS+"yamata.glb", scene).then(function (result) {
    bosses[2].node = result.meshes[0];//frog;
    bosses[2].main = bosses[2].node._children[0];
    bosses[2].node._children[0].isVisible = false;

    // bosses[2].node.isVisible = false;
    boss.scaling = new Vec3(-6,6,6)
  });

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
  camera = new BABYLON.UniversalCamera("MainCamera", new BABYLON.Vector3(0, 3, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  camera.inputs.attached.keyboard.detachControl();
  camera.fov = 1; // 0.5-2.0

  camera2 = new BABYLON.ArcRotateCamera("Camera2", -2.5, 1.25, 10, new Vec3(0, 0, 0), scene);
  camera2.setTarget(BABYLON.Vector3.Zero());
  camera2.attachControl(canvas, true);
  camera2.radius = 55;
  // camera2.inputs.attached.mousewheel.wheelPrecisionY = .1;
  camera2.wheelDeltaPercentage = 0.01;


  scene.activeCamera = camera2;
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
// 67 oct
// 12 tri min
// 57 TRI-AUG motions(56,64, 7, 14)
// 61
// 41
// 43
// 44

let blobs = [];
for (i=0; i<7; i++){
  blobs.push()
}



let rayHelper = new BABYLON.RayHelper();
function update(dt, t){
  // let x = Math.cos(x);
  // let z = Math.sin(z);
  procInput();

  
  player.pb.integrate(1/dt);
  
  

  


  // let hitRay = new BABYLON.Ray(player.node.absolutePosition, camera.getForwardRay(), 99);
  let hitRay = new BABYLON.Ray(player.node.absolutePosition, new Vec3(0,player.node.position.y, 0).subtract(player.node.absolutePosition), .6);
  rayHelper.dispose();
  // rayHelper = new BABYLON.RayHelper(hitRay);	
  // rayHelper.show(scene);		
  // rayHelper.attachToMesh(player.node, localMeshDirection, localMeshOrigin, length);

  let hit = hitRay.intersectsMeshes(scene.meshes);
// log(hit)

for (var i=0; i<hit.length; i++){
  if (hit[i].pickedMesh.name == 'Board'){
    // log(hit[i].pickedMesh.name)
    // player.pb.sImp.z += 55;
    // player.pb.sVel = player.pb.sVel.negate();
    break;
  }

  if (hit[i].pickedMesh.name == 'triFinal'){
    // makeBoop('frog', .3);
  }

  if (hit[i].pickedMesh.name == 'tri' && hit[i].pickedMesh.isVisible){
    if (player.pb.sImp.z >= 0){

      hit[i].pickedMesh.isVisible = false;
      notice = true;

      boss.life --;
      if (boss.life <= 0){
        
        boss.move("exit");
        bossn < 2 ? bossn++ : bossn=0;
        boss = bosses[bossn];
        boss.move("enter");
        // makeBoop('boing');




        scene.meshes.forEach(t=>{if (t.name=='tri')t.isVisible=true});


        // hit[i].pickedMesh.name == 'tri' && hit[i].pickedMesh.isVisible
      }

      boss.node.scaling= boss.node.scaling.scale(1.019);
    }
    // boss.position.y += .02;

  }
}
  // if (hit[0]){
  //   // if (hit[0].pickedMesh.name == 'tri')

  //   if (hit[0].pickedMesh.name == 'tri')
  //   else
  //   log(hit[0].pickedMesh.name)
  // }
}




function Boss(ops){
 this.name = ops.name; 
 this.life = ops.life;//15x5 
 this.maxLife = ops.life;
 this.file = ops.file;

 this.node;
 this.main;


}
Boss.prototype.move=function(move){
  switch(move){
    case 'enter':
      // this.node._children[0].isVisible = true;

      this.main.isVisible = true;
    break;
    case 'exit':
      this.main.isVisible = false;

      this.life = this.maxLife;
      // this.node._children[0].isVisible = false;
    break;
    case 'stare':

      this.node.lookAt(boss.node.position.subtract(player.node.position));
    break;
  }
}
let bossn = 0;
let bosses = [
  new Boss({name:'Gamachan', life:30, file:'frog'}),
  new Boss({name:'Sansan', life:45, file:'san'}),
  new Boss({name:'YamataNoOrichi', life:69, file:'yamata'})
]
boss = bosses[bossn];


function render(a, b){
  let spin = player.pb.interpolate(a,b).x;

  let pRad = player.pb.state.spyn.z;

  player.node.position.x = pRad*Math.cos(spin);
  player.node.position.z = pRad*Math.sin(spin);
  
  player.node.position.y = player.pb.state.spyn.y;

  player.node.lookAt(new Vec3(0,0,0));


  if (life) {
    life.width = boss.life/boss.maxLife;
  }
  boss.node.lookAt(player.node.position)
  

  if(player.pb.sVel.x > 0.5)
    player.node.rotate(new Vec3(0,1,0),1.17);

  if(player.pb.sVel.x < -0.5)
    player.node.rotate(new Vec3(0,1,0),-1.17);
  // player.node.lookAt(player.node.right.negate());


  if (scene.activeCamera.name=='MainCamera'){
    bushes.rotation.y -= player.pb.sVel.x*.11*.09;
    rocks.rotation.y -= player.pb.sVel.x*.11*.11;

  }


  let cRad = pRad + 2;  
  camera.position.x = cRad*Math.cos(spin);
  camera.position.z = cRad*Math.sin(spin);
  camera.position.y = player.node.position.y +0.7;//  + Math.abs(player.node.position.y+1)*1.2
  if (player.pb.sVel.x !== 0) camera.setTarget(Vec3.Zero());

  scene.render();
}







let projectiles=[];
function Projectile(){
  this.startPos;
  this.vel;
  this.acc;
}






function PBody(){
  this.mass = 200;
  this.friction = -.04;
  this.rebound = 0;

  this.sImp = new Vec3();
  this.sAcc = new Vec3();
  this.sVel = new Vec3();
  
  this.state = {
    spyn: new Vec3(),
    // loc: new Vec3(),
    // spin: 0,
    // level: 0
  }
  this.prevState = {
    spyn: new Vec3(),
    // loc: new Vec3(),
    // spin: 0,
    // level:0
  }
}
PBody.prototype.interpolate = function(a, b){
  return {
    // spin: this.state.spyn.x*a+this.prevstate.spyn.x*b,
    x: this.state.spyn.x*a+this.prevState.spyn.x*b

  }
}
PBody.prototype.integrate = function(dt){
  // save state
  // this.prevState.loc = this.state.loc.clone();
  this.prevState.spyn = this.state.spyn.clone();

  // this.rebound *= .01;
  if (Math.abs(this.rebound) < 0.001)
    this.rebound = 0;

  let max = 1.4;
  if (this.state.spyn.x > max)
    this.rebound += this.state.spyn.x - max;
  if (this.state.spyn.x < -max)
    this.rebound += this.state.spyn.x + max;
  
  this.rebound *= .16;



  // imp -> acc
  if (Math.abs(this.sVel.x) < 3 && Math.abs(this.state.spyn.x) < 2) this.sImp.x *= .23; // slow interia
  this.sImp.x += this.sVel.x * this.friction;
  this.sImp.x -= this.rebound;
  this.sAcc.x = this.sImp.x*this.mass;
  
  this.sAcc.y = this.sImp.y*this.mass;
  this.sAcc.y -= 4*9.8*this.mass*dt;

  if (player.pb.state.spyn.z < 14){
    player.pb.sImp.z += 55;
  }
  this.sAcc.z = this.sImp.z*this.mass;
  // if (this.state.spyn.y > -1) {
  // }
  // else {
  //   this.sAcc.y = 0;
  //   // this.sVel.y = 0;
  // }
  this.sImp = new Vec3();
  



  // acc -> vel
  this.sVel.x+=(this.sAcc.x*dt);
  if (Math.abs(this.sVel.x) < 0.001)
    this.sVel.x = 0;


  this.sVel.y += this.sAcc.y*dt;

  this.sVel.z += this.sAcc.z*dt;

  // if (player.node.position.y < -1) {
  //   this.state.loc.y = -1;
  //   player.node.position.y = -1;
  // }

  // vel -> pos
  this.state.spyn.x += this.sVel.x*dt;

  
  // floor
  this.state.spyn.y += this.sVel.y*dt;
  let fl = 1.9;
  // let floor = 
  if (this.state.spyn.y > (fl*jumpStop)) jumpTrigger = true;

  if (this.state.spyn.y < -2+((fl*jumpStop))) {
    this.state.spyn.y = -2+((fl*jumpStop));
    this.sVel.y = 0;
    if (jumpTrigger == true){

      jumpTrigger = false;
      if (jumpStop < 3)
        jumpStop++;
    }
  }


  // let ZEROVELOCITY = .01;
  
  this.state.spyn.z += this.sVel.z*dt;
  if (this.state.spyn.z < 35){
    this.state.spyn.z ++;
    this.sVel.z = 0;
  }

}


