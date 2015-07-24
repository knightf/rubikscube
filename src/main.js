/**
*
* Rubik's Cube
* Small web game done with three.js
*
**/

var Rubik= {} || Rubik;

Rubik.settings = {
	'renderer' : {
		'width' : window.innerWidth,
		'height' : window.innerHeight,
	},
	'cube' : {
		'stage' : 3,
		'sideLength' : 1,
		'gap' : 0.05,
		'facet' : [	0xfff000, 0xffff00, 0xffffff, 0x00ffff, 0x0000ff, 0xff00ff ],
	},
	'camera' : [{
		'fov' : 75,
		'near' : 0.1,
		'far' : 1000,
	}],
}

//create a renderer
Rubik.renderer = new THREE.WebGLRenderer();

//create a scene
Rubik.scene = new THREE.Scene();

//camera
Rubik.cameras = {
	'camera0' : new THREE.PerspectiveCamera(),
}

//load mesh into the scene
Rubik.loadScene = function(scene){
	//load cubes in
	var cubes = this.mesh.getCubes();
	for(var i = 0; i < cubes.length; i++)
		scene.add(cubes[i]);
}

//load light into the scene
Rubik.loadLight = function(scene){
	var light1 = new THREE.PointLight( 0xffffff, 2.5, 100 );
	light1.position.set( -6, -6, -6 );
	var light2 = new THREE.PointLight( 0xffffff, 2.5, 100 );
	light2.position.set( 6, 6, 6 );

	scene.add( light1, light2);
}

//set up camera
Rubik.setupCamera = function(camera){
	var rendererSettings = this.settings.renderer;
	var cameraSetting = this.settings.camera[0];

	camera.fov = cameraSetting.fov;
	camera.aspect = rendererSettings.width / rendererSettings.height;
	camera.near = cameraSetting.near;
	camera.far = cameraSetting.far;

	camera.position.x = 5;
	camera.position.y = 5;
	camera.position.z = 5;

	var cubeSetting = this.settings.cube;
	var focus = cubeSetting.sideLength * cubeSetting.stage / 2;
	camera.lookAt( new THREE.Vector3( focus, focus, focus ) );

	camera.updateProjectionMatrix();
}

//animate up
Rubik.frameUpdate = function(scene, camera){
	var _ = Rubik;
	
	//start the interact ticking
	_.interaction.tick(camera, scene);
}

//the function to trigger the rendering
Rubik.startRendering = function(renderer, camera, scene){
	var _ = Rubik;
	var rendererSettings = this.settings.renderer;

	//set renderer up
	renderer.setSize( rendererSettings.width , rendererSettings.height );
	//append the renderer to the webpage
	document.body.appendChild(renderer.domElement);

	function render(){
		requestAnimationFrame(render);

		_.frameUpdate(scene, camera);
		renderer.render(scene, camera);
	}
	render();
}

//deploy function
Rubik.deploy = function(){
	var _ = Rubik;
	var renderer = _.renderer,
		scene = _.scene,
		camera = _.cameras.camera0,
		frameUpdate = _.frameUpdate;

	//get mesh ready in scene
	_.loadScene(scene);

	//get light ready in scene
	_.loadLight(scene);

	//get camera ready in scene
	_.setupCamera(camera);

	//initialize interaction
	_.interaction.initialize();

	//kickoff rendering
	_.startRendering(renderer, camera, scene);
}

