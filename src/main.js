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
		'sideLength' : 2,
		'gap' : 0.1,
		'facet' : [
			THREE.ImageUtils.loadTexture( './images/blue.jpg' ),
			THREE.ImageUtils.loadTexture( './images/green.jpg' ),
			THREE.ImageUtils.loadTexture( './images/orange.jpg' ),
			THREE.ImageUtils.loadTexture( './images/pink.jpg' ),
			THREE.ImageUtils.loadTexture( './images/red.jpg' ),
		],
	},
	'camera' : [{
		'fov' : 75,
		'near' : 0.1,
		'far' : 1000,
	}],
}

//create a renderer
Rubik.renderer = new THREE.WebGLRenderer({ alpha: true });

//create a scene
Rubik.scene = new THREE.Scene();

//camera
Rubik.cameras = {
	'camera0' : new THREE.PerspectiveCamera(),
}

//interface
Rubik.interfaceState = 'waiting';

//load mesh into the scene
Rubik.loadScene = function(scene){
	//load cubes in
	var cubes = this.mesh.getCubes();
	for(var i = 0; i < cubes.length; i++)
		scene.add(cubes[i]);
}

//load light into the scene
Rubik.loadLight = function(scene){
	var light = new THREE.PointLight( 0xfefff0, 2.4, 100 );
	light.position.set( 12, 12, 12 );
	scene.add( light );
}

//set up camera
Rubik.setupCamera = function(camera){
	var rendererSettings = this.settings.renderer;
	var cameraSetting = this.settings.camera[0];

	camera.fov = cameraSetting.fov;
	camera.aspect = rendererSettings.width / rendererSettings.height;
	camera.near = cameraSetting.near;
	camera.far = cameraSetting.far;

	camera.position.x = 12;
	camera.position.y = 10;
	camera.position.z = 12;

	var cubeSetting = this.settings.cube;
	var focus = cubeSetting.sideLength * cubeSetting.stage / 2;
	camera.lookAt( new THREE.Vector3( focus, focus, focus ) );

	camera.updateProjectionMatrix();
}

//animate up
Rubik.frameUpdate = function(scene, camera){
	var _ = Rubik;

	if(_.interface.flag === 'randoming')
		_.interface.randomTick(scene);

	//start the interact ticking
	_.interaction.tick(camera, scene);

	//start the interface ticking only when the cube is ready (randomized)
	if(_.interaction.flag === 'idle'){
		switch(_.interface.flag){
			case 'wholeY':
				_.interface.wholeTick('y', scene);
				break;
			case 'wholeX':
				_.interface.wholeTick('x', scene);
				break;
			case 'wholeZ':
				_.interface.wholeTick('z', scene);
				break;
			default:
				return;
		}
	}
}

//the function to trigger the rendering
Rubik.startRendering = function(renderer, camera, scene){
	var _ = Rubik;
	var rendererSettings = this.settings.renderer;

	//set renderer up
	renderer.setSize( rendererSettings.width , rendererSettings.height );
	//bind the window resize event
	window.addEventListener('resize', function(){ _.domEvents.onResize(camera, renderer) }, false);

	//append the renderer to the webpage
	document.getElementById('canvasWrapper').appendChild(renderer.domElement);

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

	//kickoff rendering
	_.startRendering(renderer, camera, scene);

	//initialize interaction
	_.interaction.initialize(camera);

}

