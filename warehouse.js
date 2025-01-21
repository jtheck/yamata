

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

function nowMek(){
  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.alpha = 1.0;
  mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);

  var polygons = [];
  var rotations = [];
  var divs = {};
  var counter = 0;
  var col = 0;
  var raw = 0;
  for (var p in POLYHEDRA) {
    
    var polygon = createPolyhedron(POLYHEDRA[p].name, POLYHEDRA[p], 2, scene);
    polygon.convertToFlatShadedMesh();
    polygon.material = mat;
    col = counter % 21;
    if (col == 0) { raw++ }
    polygon.position.x = (col - 10) * 8;
    polygon.position.y = (raw - 3) * 8;
    polygons.push(polygon);
    rotations.push((0.5 - Math.random()) / 8);
    // divs[POLYHEDRA[p].name] = createDiv(POLYHEDRA[p].name);
    
    counter++;
  }
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