/**
*
* Rubik's Cube
* Small web game done with three.js
*  - Interface -
*
**/

Rubik.interface = {
	'flag' : 'waiting',

	'rotatingPivot' : null,
	'rotatingCubes' : null,
	'rotatingAxis' : null,
	'rotationDestination' : Math.PI / 2,
	'rotatingStep' : Math.PI / 15,

	'randomTimes' : 1,
	'randomCounter' : 0,

	'setFlag' : function(newFlag){
		var _ = this;
		if(newFlag === 'reset')
			_.flag = 'waiting';
		else if(_.flag === 'waiting')
			_.flag = newFlag;
	},

	//function that randomly rotates one level
	'randomTick' : function(){
		var _ = this;

		//if the counter < maxtimes and it is not animating, do the random
		if(_.randomCounter < _.randomTimes){
			//call for a random
			//add counter up
			_.randomCounter++;
			console.log('randoming for the ' + _.randomCounter + ' time.');
		}else{
			//reset the flag
			_.setFlag('reset');
			//initialize the interaction flag
			Rubik.interaction.flag = 'idle';
			console.log('%cstart to listen for user\'s interactions', 'color: red');
		}	
	},

	//function that rotates the whole cube
	'wholeTick' : function(axis, scene){
		var _ = this,
			cubeSetting = Rubik.settings.cube,
			centerPoint = (cubeSetting.stage * cubeSetting.sideLength - cubeSetting.gap) / 2;

		if(_.rotatingPivot === null){
			//this is the first tick, do preparation
			_.rotatingPivot = new THREE.Object3D();
			//set the position
			_.rotatingPivot.position.x = _.rotatingPivot.position.y = _.rotatingPivot.position.z = centerPoint;
			console.log(_.rotatingPivot.position);
			//attach pivot to the scene
			scene.add(_.rotatingPivot);
			_.rotatingPivot.updateMatrixWorld();
			_.rotatingPivot.rotation.set(0, 0, 0);

			//attach all the cubes to pivot
			_.rotatingCubes = _.getAllCubes( scene );
			for(var i = 0; i < _.rotatingCubes.length; i++)
				THREE.SceneUtils.attach( _.rotatingCubes[i], scene, _.rotatingPivot );

			//set rotating axis
			_.rotatingAxis = axis;

			console.log('%cdoing rotating as a whole now', 'background: yellow; color: black');
		}
		//tick
		Rubik.interaction.rotateAnimate(_);
	},

	'getAllCubes' : function(scene){
		var cubes = [];
		for(var i = 0; i < scene.children.length; i++){
			if( scene.children[i].name === 'cube')
				cubes.push(scene.children[i]);
		}
		return cubes;
	},

	'releaseCubes' : function(_){
		var axis = _.rotatingAxis,
			scene = Rubik.scene;

		console.log('%ccleaning up...', 'background: red; color: white');
		//console.log(_.rotatingPivot.rotation);

		_.rotatingPivot.updateMatrixWorld();
		//all cleared up, release the cubes from the pivot
		for(var i = 0; i < _.rotatingCubes.length; i++){
    		THREE.SceneUtils.detach( _.rotatingCubes[i], _.rotatingPivot, scene );
    		_.rotatingCubes[i].updateMatrixWorld();
    	}
    	//remove the pivot
		scene.remove(_.rotatingPivot);

		//clear cache, get ready for next rotation
		_.rotatingPivot = null;
		_.rotatingAxis = null;
		_.rotatingCubes = null;
		//reset the flag to idle
		_.setFlag('reset');
		console.log('%cflag is wating now', 'background: yellow; color: black');
	},
}
