


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
let rolley;
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

  board = skullCSG.subtract(sphereCSG).toMesh("Trouble");
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
    case 'ArrowUp': 
      // Playroom.myPlayer().setState("dir", 'boop');

    break;
    case 'KeyA':
    case 'KeyS':
    case 'ArrowLeft':
      keyState.left = state;
    break;
    case 'ArrowDown':
      keyState.down = state;
      // log(e)
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
    player.pb.imp -= impulse;

  }
  if (keyState.right){
    player.pb.imp += impulse;

  }

  if (keyState.boost){
    player.pb.imp *= 2;

  }

  if (keyState.up){

    player.node.position.y += .05;
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


let triangle;
function makeScene(){
  scene.autoClear = false; // Preserve background
  // scene.clearColor = ColorHex("#ffffff");
  
  makeCamera();

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



  ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 42, height: 42}, scene);
  ground.position.y = -3;

  let mat = new BABYLON.StandardMaterial("name", scene);
  let file = ASS+"grass.jpg";
  mat.emissiveTexture = new BABYLON.Texture(file, scene);
  mat.ambientTexture = new BABYLON.Texture(file, scene);
  mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  mat.specularColor = new BABYLON.Color3(.1, .3, .1);
  ground.material = mat;

  // pyramid.material
  // log(pyramid)
  triangle = BABYLON.MeshBuilder.CreateCylinder('tri', {diameter:3, tessellation:3, height:1}, scene);
  triangle.rotation.z = Math.PI*.5;
  triangle.position.x = -11;
  triangle.position.y -= 2.5;
  triangle.position.z -= 4.7;
  triangle.setEnabled(false);
  // triangle.position.x = -8;
  // triangle.rotation.z -= .92;
  triangleInv = BABYLON.MeshBuilder.CreateCylinder('tri', {diameter:3, tessellation:3, height:1}, scene);
  triangleInv.rotation.z = Math.PI*1.5;
  triangleInv.position.y += .75;
  triangleInv.position.z += 1.5;
  triangleInv.bakeCurrentTransformIntoVertices();
  triangleInv.position.x = -11;
  triangleInv.position.y -= 2.5;
  triangleInv.position.z -= 4.7;
  triangleInv.setEnabled(false);
  
  // triangleInv.rotation.z -= .92;
  log(triangle.position)
  faces = [];
for (var f=0; f<5; f++){
  face = [];
  for (var i=0; i<4; i++){
    var tri = triangle.createInstance();
    tri.position.z += i*3;
    // tri.position.y += j*3;
    face.push(tri);
    if (i!=3){
      var tri = triangleInv.createInstance();
      tri.position.z += i*3;
      // tri.position.y += j*3;
      face.push(tri);

    }

    for(var j=-2; j<2; j++){
      for (var k=-1; k<1; k++){
      }
    }
  }
  for (var i=0; i<3; i++){
    var tri = triangle.createInstance();
    tri.position.z += i*3+1.5;
    tri.position.y += 2.4;
    face.push(tri);
    if (i!=2){
      var tri = triangleInv.createInstance();
      tri.position.z += i*3+1.5;
      tri.position.y += 2.4;
      face.push(tri);

    }
  }
  for (var i=0; i<2; i++){
    var tri = triangle.createInstance();
    tri.position.z += i*3+3;
    tri.position.y += 4.8;
    face.push(tri);
    if (i!=1){
      var tri = triangleInv.createInstance();
      tri.position.z += i*3+3;
      tri.position.y += 4.8;
      // tri.bakeCurrentTransformIntoVertices();

      face.push(tri);

    }
  }
  let die = new BABYLON.TransformNode();
  for (i=0; i<face.length; i++){
    // log(face[i])
    face[i].parent = die;
  }
  die.rotation.z-=.92;
  die.position.y-=9.4;
  // die.rotation.y+=((2*Math.PI)/5)*f;
  // die.position.x += 9;
  die.rotate(BABYLON.Vector3.Up(), ((2*Math.PI)/5)*f, BABYLON.Space.WORLD);



  faces.push(die);
  // let die2 = new BABYLON.TransformNode();
  // for (i=0; i<die.children.length; i++){
}


  boss = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1.5, segments: 32}, scene);

  player.node = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: .5, segments: 32}, scene);
  player.node.setEnabled(false);

  BABYLON.SceneLoader.ImportMeshAsync(null, '', ASS+"isopod.glb", scene).then(function (result) {
    rolley = result.meshes[0];//.createInstance()
    rolley.scaling = new Vec3(-.5,.5,.5)
    // log(rolley)
    player.node = null;
    player.node = rolley;
    player.node.position.y = -1;
  });
  BABYLON.SceneLoader.ImportMeshAsync(null, '', ASS+"frog.glb", scene).then(function (result) {
    // var range = 70
    // for(var i = 0; i<100; i++){
    //      var x = range / 2 - Math.random() * range;
    //      var z = range / 2 - Math.random() * range;
    
            boss = result.meshes[0];//.createInstance()
            // boss.scaling = new Vec3(1.2,1.2,1.2)
            // boss.position = new Vec3(0,1,0);
    // }
    //   scene.getAnimationGroupByName("Run").start();
    // scene.getAnimationGroupByName("Run").loopAnimation = true;
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
// 
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var life = BABYLON.GUI.Button.CreateSimpleButton("Alive", "Alive");
  life.width = 0.8; // 0.2 = 20%
  life.height = "24px";
  life.cornerRadius = 20;
  life.color = "white";
  life.thickness = 1;
  life.background = "green";

  life.top = "-46%"; //200 px
  life.left = "1%";
  life.onPointerClickObservable.add(() => {
      // life.top = "-40%";
      // life.left = -50;
      // life.background = "red";
      // log(life)
      life.width = 0.4;
  });
  advancedTexture.addControl(life);


  var life = BABYLON.GUI.Button.CreateSimpleButton("mute", "mute");
  life.width = "46px"; // 0.2 = 20%
  life.height = "46px";
  life.cornerRadius = 20;
  life.color = "white";
  // life.thickness = 1;
  // life.background = "green";

  life.top = "30 px"; //200 px
  life.left = "-45%";
  life.onPointerClickObservable.add(() => {
      // life.top = "-40%";
      // life.left = -50;
      // life.background = "red";
      // log(life)
      makeBoop('boing');
  });
  advancedTexture.addControl(life);
  // 🔇
  var life = BABYLON.GUI.Button.CreateSimpleButton("start", "start");
  life.width = "46px"; // 0.2 = 20%
  life.height = "46px";
  life.cornerRadius = 20;
  life.color = "white";
  // life.thickness = 1;
  // life.background = "green";

  life.top = "-30px"; //200 px
  life.left = "-45%";
  life.onPointerClickObservable.add(() => {
      scene.activeCamera = camera;
      makeBoop('frog');

  });
  advancedTexture.addControl(life);

}


function makeCamera(){
  camera = new BABYLON.UniversalCamera("MainCamera", new BABYLON.Vector3(0, 3, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  // camera.inputs.attached.keyboard.detachControl();
  camera.fov = 1; // 0.5-2.0

  camera2 = new BABYLON.ArcRotateCamera("Camera2", -2.5, 1.25, 10, new Vec3(0, 0, 0), scene);
  camera2.setTarget(BABYLON.Vector3.Zero());
  camera2.attachControl(canvas, true);
  camera2.radius = 55;

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




function update(dt, t){
  // let x = Math.cos(x);
  // let z = Math.sin(z);
  procInput();


  player.pb.integrate(1/dt);

}

function render(a, b){
  let spin = player.pb.interpolate(a,b).spin;
  // player.node.absolutePosition.x = 5*Math.cos(spin);
  // player.node.absolutePosition.z = 5*Math.sin(spin);

  let pRad = 18;

  player.node.position.x = pRad*Math.cos(spin);
  player.node.position.z = pRad*Math.sin(spin);

  player.node.lookAt(new Vec3(0,0,0));
  
  // if(player.pb.state.spin > 0.5)
    if(player.pb.vel > 0.5)
      player.node.rotate(new Vec3(0,1,0),1.17);

    // player.node.lookAt(player.node.right.scale(10));
  // if(player.pb.state.spin < -0.5)
    if(player.pb.vel < -0.5)
      player.node.rotate(new Vec3(0,1,0),-1.17);
    // player.node.lookAt(player.node.right.negate());



  let cRad = pRad + 5;  

  camera.position.x = cRad*Math.cos(spin);
  camera.position.z = cRad*Math.sin(spin);
  camera.position.y = player.node.position.y + 1 + Math.abs(player.node.position.y+1)*1.2
  if (player.pb.vel !== 0) camera.setTarget(Vec3.Zero());

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

  // this.rebound *= .01;
  if (Math.abs(this.rebound) < 0.001)
    this.rebound = 0;

  let max = 1.4;
  if (this.state.spin > max)
    this.rebound += this.state.spin - max;
  if (this.state.spin < -max)
    this.rebound += this.state.spin + max;
  
  this.rebound *= .16;

  // imp -> acc
  if (Math.abs(this.vel) < 3 && Math.abs(this.state.spin) < 2) this.imp *= .23; // slow interia
  this.imp += this.vel * this.friction;
  this.imp -= this.rebound;
  this.acc = this.imp*this.mass;
  if (this.state.loc.y > -1) this.acc.y -= 9.8*this.mass*dt;

  this.imp=0;
  
  this.vel+=(this.acc*dt);
  if (Math.abs(this.vel) < 0.001)
    this.vel = 0;
  this.state.spin += this.vel*dt;
  
  let ZEROVELOCITY = .01;
}



makePyramid = function(obj, scene) {
  var loc = new Vec3(0,0,0);
  var h = obj;
  var name = "Pyramid";
  name = "Wire_" + name;

  var pyramidFaces = [
    0, 1, 5,
    1, 2, 5,
    2, 3, 5,
    3, 4, 5,
    4, 0, 5
    ,
    0, 4, 3,
    0, 3, 2,
    0, 2, 1
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
  // return vertexData;  
  
  vertexData.applyToMesh(pyramid);
  pyramid.setEnabled(false);
  return pyramid;
};


let volume = 1;
makeBoop = function(name){
  if (volume == 0) return;
  if (!BABYLON.Engine.audioEngine.unlocked) return;
  

  let file = ASS+name+".ogg";

  var tBoop = new BABYLON.Sound(name, file, scene, null, {
          // loop: true,
    autoplay: true
  });

  tBoop.metadata = {
    stackable: true,
    volume: 1
  };
  tBoop.setVolume(volume);
  tBoop.play()
  // log(tBoop)
  
  if (!tBoop.isPlaying || tBoop.metadata?.stackable)
    tBoop.play();
}
window.addEventListener('click', () => {
  if(!BABYLON.Engine.audioEngine.unlocked) BABYLON.Engine.audioEngine.unlock();
}, {once: true});
window.addEventListener('keydown', () => {
  if(!BABYLON.Engine.audioEngine.unlocked) BABYLON.Engine.audioEngine.unlock();
}, {once: true});