







function makeGUI(){
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // life = BABYLON.GUI.Button.CreateSimpleButton("Alive", "Alive");
  // life.width = 0.8; // 0.2 = 20%
  // life.height = "24px";
  // life.cornerRadius = 20;
  // life.color = "white";
  // life.thickness = 1;
  // life.background = "green";

  // life.top = "-46%"; //200 px
  // life.left = "1%";
  // life.onPointerClickObservable.add(() => {
  //     // life.top = "-40%";
  //     // life.left = -50;
  //     // life.background = "red";
  //     // log(life)
  //     // life.width = 0.4;
  // });
  // advancedTexture.addControl(life);


   life = BABYLON.GUI.Button.CreateSimpleButton("mute", "mute");
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
   life = BABYLON.GUI.Button.CreateSimpleButton("start", "start");
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
      camera.setTarget(Vec3.Zero());
      makeBoop('frog');

  });
  advancedTexture.addControl(life);


  life = BABYLON.GUI.Button.CreateSimpleButton("Alive", "Alive");
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
      // life.width = 0.4;
  });
  advancedTexture.addControl(life);

}




function makeAtmo(){

  ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 223, height: 223}, scene);
  ground.position.y = -3;

  mat = new BABYLON.StandardMaterial("matgrass", scene);
  let file = ASS+"grass.jpg";
  mat.emissiveTexture = new BABYLON.Texture(file, scene);
  mat.ambientTexture = new BABYLON.Texture(file, scene);
  mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  mat.specularColor = new BABYLON.Color3(.1, .3, .1);
  mat.emissiveTexture.uScale = 10; // Stretch horizontally
  mat.emissiveTexture.vScale = 10; // Stretch vertically
  mat.ambientTexture.uScale = 10; // Stretch horizontally
  mat.ambientTexture.vScale = 10; // Stretch vertically
  ground.material = mat;
  

  // grasses
  const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 1 }, scene);
  plane.isVisible = false;
  const material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = new BABYLON.Texture(ASS+"blade.png", scene); 
  material.backFaceCulling = false; // Ensure the texture is visible from both sides
  material.diffuseTexture.hasAlpha = true;
  // Apply the material to the plane
  plane.material = material;
  for (let i = 0; i < 3300; i++) {
    const instance = plane.createInstance("planeInstance" + i);

    instance.position.x = (Math.random() - 0.5) * 88; // Adjust the range as needed
    instance.position.y = -2.3;//+(Math.random()* 0.5);
    instance.position.z = (Math.random() - 0.5) * 88;
    if (Math.abs(instance.position.x) < 12 && Math.abs(instance.position.z) < 12){
      instance.dispose();
      i--;
      continue;
    }
    instance.scaling = new Vec3(1.2,1.2,1.2).add(new Vec3(1,1,1).scale(Math.random()*1.4));
    instance.rotation.x = Math.random() * .3;//Math.PI;
    instance.rotation.y = Math.random() * Math.PI;
    instance.rotation.z = Math.random() * .3;//Math.PI;
  }


  let bush = MakePoly(J43);
  for (var i=0; i < 133; i++){
    var tBush = bush.createInstance();
    var r = 75+Math.random()*75;
    var p = Math.random()*2*Math.PI;
    tBush.position = new Vec3(r*Math.cos(p), 0+Math.random()*15, r*Math.sin(p));
    tBush.scaling = new Vec3(1,1,1).scale(2+Math.random()*5)
    tBush.rotation = new Vec3(Math.random()*2*Math.PI, Math.random()*2*Math.PI, Math.random()*2*Math.PI);
    tBush.parent = rocks;
  }
  bush = MakePoly(J44);
  for (var i=0; i < 133; i++){
    var tBush = bush.createInstance();
    var r = 40+Math.random()*35;
    var p = Math.random()*2*Math.PI;
    tBush.position = new Vec3(r*Math.cos(p), -5+Math.random()*5, r*Math.sin(p));
    tBush.scaling = new Vec3(1,1,1).scale(1+Math.random()*2)
    tBush.rotation = new Vec3(Math.random()*2*Math.PI, Math.random()*2*Math.PI, Math.random()*2*Math.PI);
    tBush.parent = bushes;
  }
}



function makeBoard(){
  
  // pyramid.material
  // log(pyramid)
  triangle = BABYLON.MeshBuilder.CreateCylinder('tri', {diameter:3, tessellation:3, height:1}, scene);
  triangle.rotation.z = Math.PI*.5;
  triangle.position.x = -11;
  triangle.position.y -= 2.5;
  triangle.position.z -= 4.7;
  triangle.setEnabled(false);
  triangleInv = BABYLON.MeshBuilder.CreateCylinder('tri-1', {diameter:3, tessellation:3, height:1}, scene);
  triangleInv.rotation.z = Math.PI*1.5;
  triangleInv.position.y += .75;
  triangleInv.position.z += 1.5;
  triangleInv.bakeCurrentTransformIntoVertices();
  triangleInv.position.x = -11;
  triangleInv.position.y -= 2.5;
  triangleInv.position.z -= 4.7;
  let mat2 = new BABYLON.StandardMaterial('12', scene);
  mat2.specularColor = new BABYLON.Color3(1.07, 1.07, 0.07);
  mat2.diffuseColor = new BABYLON.Color3(1.0, 1.1, 1.3);
  triangle.material = mat;
  triangleInv.material = mat2;
  triangleInv.setEnabled(false);
  // log(triangle.position)


  faces = [];
  for (var f=0; f<5; f++){
    face = [];
    for (var i=0; i<4; i++){
      var tri = triangle.createInstance();
      tri.position.z += i*3;
      tri.name = "tri";
      face.push(tri);
      if (i!=3){
        var tri = triangleInv.createInstance();
        tri.position.z += i*3;
        tri.name = "tri";
        face.push(tri);
      }
    }
    for (var i=0; i<3; i++){
      var tri = triangle.createInstance();
      tri.position.z += i*3+1.5;
      tri.position.y += 2.4;
      tri.name = "tri";
      face.push(tri);
      if (i!=2){
        var tri = triangleInv.createInstance();
        tri.position.z += i*3+1.5;
        tri.position.y += 2.4;
        tri.name = "tri";
        face.push(tri);

      }
    }
    for (var i=0; i<2; i++){
      var tri = triangle.createInstance();
      tri.position.z += i*3+3;
      tri.position.y += 4.8;
      tri.name = "tri";
      face.push(tri);
      if (i!=1){
        var tri = triangleInv.createInstance();
        tri.position.z += i*3+3;
        tri.position.y += 4.8;
        tri.name = "tri";

        face.push(tri);

      }
    }

    var tri = triangle.createInstance();
    tri.position.z += 4.5;
    tri.position.y += 7.2;
    tri.isVisible = false;
    tri.metadata = {shield:true};
    tri.name = "triFinal";
    face.push(tri);



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


}







	  // create  polyhedron from the POLYHEDRA object
	  var createPolyhedron = function (name, data, size, scene) {
		  var positions = [];
		  var indices = [];
		  var normals = [];
		  var uvs = [];

		  var i = 0;

		  // positions
		  for (i = 0; i < data.vertex.length; i++) {
			  positions.push(data.vertex[i][0] * size, data.vertex[i][1] * size, data.vertex[i][2] * size);
			  //uvs.push(0, 0);
		  }

		  // indices from faces
		  for (var f = 0; f < data.face.length; f++) {
			  for (i = 0; i < data.face[f].length - 2; i++) {
				  indices.push(data.face[f][0], data.face[f][i + 2], data.face[f][i + 1]);
			  }
		  }

		  BABYLON.VertexData.ComputeNormals(positions, indices, normals);

		  var vertexData = new BABYLON.VertexData();
		  vertexData.positions = positions;
		  vertexData.indices = indices;
		  vertexData.normals = normals;
		  //vertexData.uvs = uvs;

		  var polygon = new BABYLON.Mesh(name, scene);
		  vertexData.applyToMesh(polygon);

		  return polygon;
	  };




// bushes
let J43 = {
  "name":"Elongated Pentagonal Gyrobirotunda (J43)",
  "category":["Johnson Solid"],
  "vertex":[[-1.099924,-0.170755,-0.018241],[-1.015744,0.184543,-0.41657],[-0.979069,0.342745,0.098809],[-0.891012,-0.645186,-0.17075],[-0.854337,-0.486985,0.344629],[-0.754806,-0.070303,-0.81526],[-0.677717,-0.583103,-0.663335],[-0.65879,0.343875,0.53402],[-0.633951,0.443197,-0.698209],[-0.581702,-0.168926,0.685945],[-0.57461,0.699173,0.135692],[-0.43213,-0.899333,-0.300465],[-0.37279,-0.643357,0.533436],[-0.361315,0.761256,-0.356893],[-0.295924,-0.324449,-0.944974],[-0.185624,0.480819,0.756166],[-0.111851,-0.898203,0.134746],[-0.108536,-0.031982,0.908091],[-0.101444,0.836117,0.357838],[-0.100377,0.50641,-0.755583],[0.100376,-0.506413,0.755582],[0.101443,-0.83612,-0.357838],[0.108535,0.031979,-0.908092],[0.111851,0.8982,-0.134747],[0.185623,-0.480822,-0.756167],[0.295923,0.324447,0.944974],[0.361314,-0.761258,0.356892],[0.372789,0.643354,-0.533437],[0.43213,0.899331,0.300464],[0.574609,-0.699176,-0.135692],[0.581701,0.168923,-0.685946],[0.63395,-0.443199,0.698208],[0.658789,-0.343878,-0.534021],[0.677716,0.583101,0.663334],[0.754804,0.0703,0.815259],[0.854336,0.486982,-0.344629],[0.891011,0.645184,0.17075],[0.979068,-0.342747,-0.09881],[1.015743,-0.184545,0.416569],[1.099923,0.170753,0.018241]],
  "edge":[[0,1],[1,5],[5,6],[6,3],[3,0],[0,4],[4,9],[9,7],[7,2],[2,0],[2,1],[7,10],[10,2],[10,13],[13,8],[8,1],[8,5],[13,19],[19,8],[19,22],[22,14],[14,5],[14,6],[22,24],[24,14],[24,21],[21,11],[11,6],[11,3],[21,16],[16,11],[16,12],[12,4],[4,3],[12,9],[33,34],[34,38],[38,39],[39,36],[36,33],[33,28],[28,18],[18,15],[15,25],[25,33],[25,34],[15,17],[17,25],[17,20],[20,31],[31,34],[31,38],[20,26],[26,31],[26,29],[29,37],[37,38],[37,39],[29,32],[32,37],[32,30],[30,35],[35,39],[35,36],[30,27],[27,35],[27,23],[23,28],[28,36],[23,18],[24,32],[29,21],[26,16],[20,12],[17,9],[15,7],[18,10],[23,13],[27,19],[30,22]],
  "face":[[0,2,1],[2,7,10],[1,8,5],[8,13,19],[5,14,6],[14,22,24],[6,11,3],[11,21,16],[3,4,0],[4,12,9],[33,25,34],[25,15,17],[34,31,38],[31,20,26],[38,37,39],[37,29,32],[39,35,36],[35,30,27],[36,28,33],[28,23,18],[24,32,29,21],[21,29,26,16],[16,26,20,12],[12,20,17,9],[9,17,15,7],[7,15,18,10],[10,18,23,13],[13,23,27,19],[19,27,30,22],[22,30,32,24],[0,1,5,6,3],[0,4,9,7,2],[1,2,10,13,8],[5,8,19,22,14],[6,14,24,21,11],[3,11,16,12,4],[33,34,38,39,36],[33,28,18,15,25],[34,25,17,20,31],[38,31,26,29,37],[39,37,32,30,35],[36,35,27,23,28]]};
let J44 = {
  "name":"Gyroelongated Triangular Bicupola (J44)",
  "category":["Johnson Solid"],
  "vertex":[[-0.789003,0.385273,-0.254111],[-0.772339,-0.452189,-0.185879],[-0.761383,0.026005,0.505125],[-0.611639,-0.798949,0.562592],[-0.381598,-0.074991,-0.82722],[-0.362623,0.753266,0.369634],[-0.289802,0.760316,-0.816621],[-0.055737,-0.771195,-0.487529],[-0.033826,0.185193,0.894479],[0.104963,-1.117956,0.260942],[0.115918,-0.639761,0.951946],[0.136578,1.128308,-0.192876],[0.452187,-0.167262,-0.776585],[0.471162,0.660994,0.420269],[0.543983,0.668044,-0.765985],[0.67182,-0.612007,-0.098176],[0.682775,-0.133813,0.592828],[0.878567,0.200731,-0.15284]],
  "edge":[[11,14],[14,6],[6,11],[11,13],[13,17],[17,14],[17,12],[12,14],[12,4],[4,6],[4,0],[0,6],[0,5],[5,11],[5,13],[9,10],[10,3],[3,9],[9,15],[15,16],[16,10],[16,8],[8,10],[8,2],[2,3],[2,1],[1,3],[1,7],[7,9],[7,15],[4,1],[1,0],[2,0],[2,5],[8,5],[8,13],[16,13],[16,17],[15,17],[15,12],[7,12],[7,4]],
  "face":[[11,14,6],[14,17,12],[6,4,0],[11,5,13],[9,10,3],[10,16,8],[3,2,1],[9,7,15],[4,1,0],[0,1,2],[0,2,5],[5,2,8],[5,8,13],[13,8,16],[13,16,17],[17,16,15],[17,15,12],[12,15,7],[12,7,4],[4,7,1],[14,11,13,17],[6,14,12,4],[11,6,0,5],[10,9,15,16],[3,10,8,2],[9,3,1,7]]};
// poof
let SnubIcosidodecahedron = {
    "name":"Snub Icosidodecahedron",
    "category":["Archimedean Solid"],
    "vertex":[[0,0,1.028031],[0.4638569,0,0.9174342],[0.2187436,0.4090409,0.9174342],[-0.2575486,0.3857874,0.9174342],[-0.4616509,-0.04518499,0.9174342],[-0.177858,-0.4284037,0.9174342],[0.5726782,-0.4284037,0.7384841],[0.8259401,-0.04518499,0.6104342],[0.6437955,0.3857874,0.702527],[0.349648,0.7496433,0.6104342],[-0.421009,0.7120184,0.6104342],[-0.6783139,0.3212396,0.702527],[-0.6031536,-0.4466658,0.702527],[-0.2749612,-0.7801379,0.6104342],[0.1760766,-0.6931717,0.7384841],[0.5208138,-0.7801379,0.4206978],[0.8552518,-0.4466658,0.3547998],[1.01294,-0.03548596,0.1718776],[0.7182239,0.661842,0.3208868],[0.3633691,0.9454568,0.1758496],[-0.04574087,0.9368937,0.4206978],[-0.4537394,0.905564,0.1758496],[-0.7792791,0.5887312,0.3208868],[-0.9537217,0.1462217,0.3547998],[-0.9072701,-0.3283699,0.3547998],[-0.6503371,-0.7286577,0.3208868],[0.08459482,-0.9611501,0.3547998],[0.3949153,-0.9491262,-0.007072558],[0.9360473,-0.409557,-0.1136978],[0.9829382,0.02692292,-0.2999274],[0.9463677,0.4014808,-0.007072558],[0.6704578,0.7662826,-0.1419366],[-0.05007646,1.025698,-0.04779978],[-0.4294337,0.8845784,-0.2999274],[-0.9561681,0.3719321,-0.06525234],[-1.022036,-0.1000338,-0.04779978],[-0.8659056,-0.5502712,-0.06525234],[-0.5227761,-0.8778535,-0.1136978],[-0.06856319,-1.021542,-0.09273844],[0.2232046,-0.8974878,-0.4489366],[0.6515438,-0.7200947,-0.3373472],[0.7969535,-0.3253959,-0.5619888],[0.8066872,0.4395354,-0.461425],[0.4468035,0.735788,-0.5619888],[0.001488801,0.8961155,-0.503809],[-0.3535403,0.6537658,-0.7102452],[-0.7399517,0.5547758,-0.4489366],[-0.9120238,0.1102196,-0.461425],[-0.6593998,-0.6182798,-0.4896639],[-0.2490651,-0.8608088,-0.503809],[0.4301047,-0.5764987,-0.734512],[0.5057577,-0.1305283,-0.8854492],[0.5117735,0.3422252,-0.8232973],[0.09739587,0.5771941,-0.8451093],[-0.6018946,0.2552591,-0.7933564],[-0.6879024,-0.2100741,-0.734512],[-0.3340437,-0.5171509,-0.8232973],[0.08570633,-0.3414376,-0.9658797],[0.1277354,0.1313635,-1.011571],[-0.3044499,-0.06760332,-0.979586]],
    "edge":[[0,1],[1,2],[2,0],[2,3],[3,0],[3,4],[4,0],[4,5],[5,0],[1,6],[6,7],[7,1],[7,8],[8,1],[8,2],[8,9],[9,2],[3,10],[10,11],[11,3],[11,4],[4,12],[12,5],[12,13],[13,5],[13,14],[14,5],[6,14],[14,15],[15,6],[15,16],[16,6],[16,7],[16,17],[17,7],[8,18],[18,9],[18,19],[19,9],[19,20],[20,9],[10,20],[20,21],[21,10],[21,22],[22,10],[22,11],[22,23],[23,11],[12,24],[24,25],[25,12],[25,13],[13,26],[26,14],[26,15],[26,27],[27,15],[16,28],[28,17],[28,29],[29,17],[29,30],[30,17],[18,30],[30,31],[31,18],[31,19],[19,32],[32,20],[32,21],[32,33],[33,21],[22,34],[34,23],[34,35],[35,23],[35,24],[24,23],[35,36],[36,24],[36,25],[36,37],[37,25],[26,38],[38,27],[38,39],[39,27],[39,40],[40,27],[28,40],[40,41],[41,28],[41,29],[29,42],[42,30],[42,31],[42,43],[43,31],[32,44],[44,33],[44,45],[45,33],[45,46],[46,33],[34,46],[46,47],[47,34],[47,35],[36,48],[48,37],[48,49],[49,37],[49,38],[38,37],[49,39],[39,50],[50,40],[50,41],[50,51],[51,41],[42,52],[52,43],[52,53],[53,43],[53,44],[44,43],[53,45],[45,54],[54,46],[54,47],[54,55],[55,47],[48,55],[55,56],[56,48],[56,49],[50,57],[57,51],[57,58],[58,51],[58,52],[52,51],[58,53],[54,59],[59,55],[59,56],[59,57],[57,56],[59,58]],
    "face":[[0,1,2],[0,2,3],[0,3,4],[0,4,5],[1,6,7],[1,7,8],[1,8,2],[2,8,9],[3,10,11],[3,11,4],[4,12,5],[5,12,13],[5,13,14],[6,14,15],[6,15,16],[6,16,7],[7,16,17],[8,18,9],[9,18,19],[9,19,20],[10,20,21],[10,21,22],[10,22,11],[11,22,23],[12,24,25],[12,25,13],[13,26,14],[14,26,15],[15,26,27],[16,28,17],[17,28,29],[17,29,30],[18,30,31],[18,31,19],[19,32,20],[20,32,21],[21,32,33],[22,34,23],[23,34,35],[23,35,24],[24,35,36],[24,36,25],[25,36,37],[26,38,27],[27,38,39],[27,39,40],[28,40,41],[28,41,29],[29,42,30],[30,42,31],[31,42,43],[32,44,33],[33,44,45],[33,45,46],[34,46,47],[34,47,35],[36,48,37],[37,48,49],[37,49,38],[38,49,39],[39,50,40],[40,50,41],[41,50,51],[42,52,43],[43,52,53],[43,53,44],[44,53,45],[45,54,46],[46,54,47],[47,54,55],[48,55,56],[48,56,49],[50,57,51],[51,57,58],[51,58,52],[52,58,53],[54,59,55],[55,59,56],[56,59,57],[57,59,58],[0,5,14,6,1],[2,9,20,10,3],[4,11,23,24,12],[7,17,30,18,8],[13,25,37,38,26],[15,27,40,28,16],[19,31,43,44,32],[21,33,46,34,22],[29,41,51,52,42],[35,47,55,48,36],[39,49,56,57,50],[45,53,58,59,54]]};
    
function MakePoly(p){
  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.alpha = 1.0;
  if (p==J43)
    mat.diffuseColor = new BABYLON.Color3(0.2, 0.9, 0.2);
  if (p==J44)
    mat.diffuseColor = new BABYLON.Color3(0.52, 0.5, 0.5);
        
  var polygon = createPolyhedron(p.name, p, 2, scene);
  //
    if (p==J44)
  polygon.convertToFlatShadedMesh();

  polygon.material = mat;
  polygon.position.x = 0;
  polygon.position.y = 11;
  polygon.isVisible = false;
  return polygon;
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
makeBoop = function(name, speed){
  if (volume == 0) return;
  if (!speed) speed = 1;
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
  
  tBoop.setPlaybackRate(speed);
  tBoop.setVolume(volume*.5);
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

