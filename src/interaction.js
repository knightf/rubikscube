/**
*
* Rubik's Cube
* Small web game done with three.js
*  - Interaction -
*
**/

Rubik.interaction = {
	//the scene
	'scene' : Rubik.scene,
	//the beam
	'raycaster' : new THREE.Raycaster(),
	//the vector that stores cursor's coordinates
	'mouse' : new THREE.Vector2(),
	//the flag
	'flag' : null,
	//current focused cube
	'slot' : null,
	//coordinates where the detection started
	'startPoint' : null,
	//the frames we want to spend on detecting direction
	'maxDetectingFrame' : 4,
	//the couter of frames during detection
	'frameCounter' : 0,
	//essential information for rotation
	'rotatingAxis' : null,
	'rotatingPivot' : null,
	'rotatingCubes' : null,
	'baseAtan2' : null,
	'pivotVector2' : null,
	//the counter of frames during rotating, the desitination
	'rotatingCounter' : 0,
	'rotationDestination' : null,

	'initialize' : function(){
		var _ = this;

		//random the cube first
		Rubik.toolbox.random();

		//sync mouse vector with the cursor
		document.addEventListener( 'mousemove', function(){
			//do these following no matter what the flag is
			event.preventDefault();
			_.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			_.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			switch(_.flag){
				case 'detecting':
					if(_.frameCounter < _.maxDetectingFrame){
						//detection not done yet
						_.frameCounter++;
					}else{
						//detection done, analyse the information
						//the flag is still detecting because the end point may be unvalid
						_.directionCalc(_, _.mouse.clone());
					}
					break;
				case 'rotating':
					_.rotatingHandler(_);
					break;
				default:
					return false;
			}
		}, false );

		//mousedown event
		document.addEventListener( 'mousedown', function(event){
			if(event.which === 1){
				//only react to the left button
				if(_.flag === 'idle')
					//the cube is idle, start the interaction
					_.pushClickedCube(_);
			}
		}, false);

		//mouseup event
		document.addEventListener( 'mouseup', function(event){
			if(event.which === 1){
				//only react to the left button
				switch(_.flag){
					case 'detecting':
						//abort, when the flag is detecting
						_.abortDetection(_);
						break;
					case 'rotating':
						//check if it is a real rotation
						_.checkRealRotation(_);
						break;
					default:
						return false;
				}
			}
		}, false);
	},

	'tick' : function(camera, scene){
		var _ = this,
			rc = _.raycaster,
			mouse = _.mouse;

		//stick the ray to cursor
		rc.setFromCamera( mouse, camera );

		//if it is in ending phase, play the animation
	
		if(_.flag === 'ending')
			_.rotateAnimate(_);
		
	},

	'pushClickedCube' : function(_){
		var rc = _.raycaster,
			mouse = _.mouse,
			scene = _.scene,
			obj, normalVector, faceNormal;

		var intersects = rc.intersectObjects(scene.children);
		//mouse on the cube
		if(intersects.length > 0){
		//if the cursor is on a cube, then start the interaction
			//use normal face to find out which direction the start point faces
			normalVector = intersects[0].face.normal.clone();
			normalVector.applyEuler(intersects[0].object.rotation).normalize().round();
			if(normalVector.x === 1){
				faceNomal = 'x';
			}else if(normalVector.y === 1){
				faceNomal = 'y';
			}else if(normalVector.z === 1){
				faceNomal = 'z';
			}
			//push into slot
			_.slot = { 'obj' : intersects[0].object.clone(), 'facing' :  faceNomal};
			console.log('%cthe rotation starts with this cube:', 'background: red; color: white', _.slot.obj);
			console.log('%crotated normal vector is ', 'background: yellow; color black', normalVector);
			console.log('%cthe program think it\'s facing ', 'background: yellow; color black', faceNomal);
			_.startPoint = _.mouse.clone();
			_.frameCounter++;
			//change the flag to detecting
			_.flag = 'detecting';
			console.log('%cflag is detecting now', 'background: yellow; color: black');
		}
	},

	'abortDetection' : function(_){
		//reset the flag, start point and frame counter
		_.flag = 'idle';
		console.log('%cinteraction aborted during detection. flag is idle now', 'background: yellow; color: black');

		_.startPoint = null;
		_.frameCounter = 0;
		//clear the slot
		_.slot = null;
	},

	'directionCalc' : function(_, coo){
		var angle;
		var baseXZ = new THREE.Vector2(1, 1).normalize();
		var baseY = new THREE.Vector2(0, 1);

		//reset the counter anyway
		_.frameCounter = 0;
		//valid point
		if(!coo.equals(_.startPoint)){
			//V2 - V1, calculate the angle between normalized (1, 1)
			var direction = coo.sub(_.startPoint).normalize();
			
			var rs = null;
			if(_.slot.facing === 'x'){
				angle = (Math.atan2(baseXZ.y, baseXZ.x) - Math.atan2(direction.y, direction.x))*180/Math.PI;
				if( ((-90 < angle) && (angle < 0)) || ((90 < angle) && (angle < 180)) ){
					rs = 'z';
				}else{
					rs = 'y';
				}
			}else if(_.slot.facing === 'y'){
				angle = (Math.atan2(baseY.y, baseY.x) - Math.atan2(direction.y, direction.x))*180/Math.PI;
				if( ((-90 < angle) && (angle < 0)) || ((90 < angle) && (angle < 180)) ){
					rs = 'z';
				}else{
					rs = 'x';
				}				
			}else{
				//facing z
				angle = (Math.atan2(baseXZ.y, baseXZ.x) - Math.atan2(direction.y, direction.x))*180/Math.PI;
				if( ((-90 < angle) && (angle < 0)) || ((90 < angle) && (angle < 180)) ){
					rs = 'x';
				}else{
					rs = 'y';
				}				
			}
			//push the result into the parent object
			_.rotatingAxis = rs;
			//do the prepration for rotating
			_.prepareRotating(_);
		}
	},

	'prepareRotating' : function(_){
		var scene = Rubik.scene,
			cubeSetting = Rubik.settings.cube,
			centerPoint = (cubeSetting.stage * cubeSetting.sideLength - cubeSetting.gap) / 2,
			camera = Rubik.cameras.camera0;

		_.rotatingPivot = new THREE.Object3D();

		//find the right position of the pivot
		if(_.rotatingAxis === 'x'){
			var pivotX = _.slot.obj.position.x;
			var pivotY = centerPoint;
			var pivotZ = pivotY;
		}else if(_.rotatingAxis === 'y'){
			var pivotX = centerPoint;
			var pivotY = _.slot.obj.position.y;
			var pivotZ = pivotX;
		}else{
			//rotating on z axis
			var pivotX = centerPoint;
			var pivotY = pivotX;
			var pivotZ = _.slot.obj.position.z;
		}
		_.rotatingPivot.position.x = pivotX;
		_.rotatingPivot.position.y = pivotY;
		_.rotatingPivot.position.z = pivotZ;
		console.log('%cpivot is at:', 'background: blue; color: cyan', _.rotatingPivot.position);

		//attach pivot to the scene
		scene.add(_.rotatingPivot);
		_.rotatingPivot.updateMatrixWorld();
		_.rotatingPivot.rotation.set(0, 0, 0);

		//find all the cubes needs to be rotated
		_.rotatingCubes = _.getRotatingCubes(_.rotatingAxis, _.slot.obj, scene);
		//attach them to the pivot
		for(var i = 0; i < _.rotatingCubes.length; i++)
			THREE.SceneUtils.attach( _.rotatingCubes[i], scene, _.rotatingPivot );

		//calculate the base atan2 for later radian calculation
		var projectedPivotLocation = _.rotatingPivot.position.clone().project(camera);
		_.pivotVector2 = new THREE.Vector2(projectedPivotLocation.x, projectedPivotLocation.y);
		var baseVector = _.startPoint.clone().sub(_.pivotVector2);
		_.baseAtan2 = Math.atan2(baseVector.y, baseVector.x);

		//all done, change flag from detecting to rotating
		_.flag = 'rotating';
		console.log('%cflag is rotating now', 'background: yellow; color: black');
	},

	'getRotatingCubes' : function(axis, obj, scene){
		var cubes = [],
			target;

		target = obj.position[axis];
		for(var i = 0; i < scene.children.length; i++){
			if( (Math.abs(scene.children[i].position[axis] - target) < 0.1) && (scene.children[i].name === 'cube'))
				cubes.push(scene.children[i]);
		}
		console.log('%cthere are the cubes to be rotated: ', 'background: blue; color: cyan', cubes);
		return cubes;
	},

	'rotatingHandler' : function(_){
		var axis = _.rotatingAxis;

		console.log('%crotating around', 'color: #bbb', _.rotatingAxis);

		var currentVector = _.mouse.clone().sub(_.pivotVector2);
		var angle = Math.atan2(currentVector.y, currentVector.x) - _.baseAtan2;
		//make angle in -pi/2 to pi/2
		if(angle < -Math.PI)
			angle += Math.PI * 2;
		if(angle > Math.PI)
			angle -= Math.PI * 2;
		
		if((-Math.PI/2 < angle) && (angle < Math.PI/2)){
			if(Math.abs(angle - _.rotatingPivot.rotation[axis]) < Math.PI/2 ){
				if(axis === 'x'){
					_.rotatingPivot.rotation.set(angle, 0, 0);
				}else if(axis === 'y'){
					_.rotatingPivot.rotation.set(0, angle, 0);
				}else if(axis === 'z'){
					_.rotatingPivot.rotation.set(0, 0, angle);
				}
			}
		}
		
	},

	'checkRealRotation' : function(_){
		var axis = _.rotatingAxis,
			scene = Rubik.scene;

		console.log('%cchecking if it is a valid rotation', 'background: green; color: white');
		//console.log(_.rotatingPivot.rotation);
		_.flag = ('ending');
		console.log('%cflag is ending now', 'background: yellow; color: black');

		if(_.rotatingPivot.rotation[axis] + Math.PI / 2  < Math.PI / 3){
			console.log('%cvalid for clockwise', 'background: green; color: white');
			_.rotationDestination = -Math.PI/2;
		}else if(Math.PI / 2 - _.rotatingPivot.rotation[axis] < Math.PI / 3){
			console.log('%cvalid for conter-clockwise', 'background: green; color: white');
			_.rotationDestination = Math.PI/2;
		}else{
			console.log('%cnot a valid rotation, reset', 'color: green');
			_.rotationDestination = 0;
		}
	},

	'rotateAnimate' : function(_){
		var step = Math.PI / 80;
			axis = _.rotatingAxis;
			radians = _.rotationDestination;

		if(_.rotatingPivot === null)
			return false;

		if(Math.abs(_.rotatingPivot.rotation[axis] - radians) <= step){
			//the animation reaches its end, because what is left is less then a step or because the frame limit
			if(axis === 'x'){
				_.rotatingPivot.rotation.set(radians, 0, 0);
			}else if(axis === 'y'){
				_.rotatingPivot.rotation.set(0, radians, 0);
			}else if(axis === 'z'){
				_.rotatingPivot.rotation.set(0, 0, radians);
			}
			//release cubes
			_.releaseCubes(_);
		}else{
			console.log('%cdoing the rest of animation', 'color: #bbb');
			//animate
			//if desination - current > 0, then the rotation needs to get greater
			if((_.rotationDestination - _.rotatingPivot.rotation[axis]) > 0){
				if(axis === 'x'){
					_.rotatingPivot.rotation.set(_.rotatingPivot.rotation[axis] + step, 0, 0);
				}else if(axis === 'y'){
					_.rotatingPivot.rotation.set(0, _.rotatingPivot.rotation[axis] + step, 0);
				}else if(axis === 'z'){
					_.rotatingPivot.rotation.set(0, 0, _.rotatingPivot.rotation[axis] + step);
				}
			}else{
			//else it needs to get smaller
				if(axis === 'x'){
					_.rotatingPivot.rotation.set(_.rotatingPivot.rotation[axis] - step, 0, 0);
				}else if(axis === 'y'){
					_.rotatingPivot.rotation.set(0, _.rotatingPivot.rotation[axis] - step, 0);
				}else if(axis === 'z'){
					_.rotatingPivot.rotation.set(0, 0, _.rotatingPivot.rotation[axis] - step);
				}
			}
		}

		_.rotatingCounter++;
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
		_.rotatingCounter = 0;
		_.rotationDestination = null;
		//reset the flag to idle
		_.flag = 'idle';
		console.log('%cflag is idle now', 'background: yellow; color: black');
	},
}

/*
var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    rotWorldMatrix.multiply(object.matrix);                // pre-multiply
    object.matrix = rotWorldMatrix;

    object.rotation.setFromRotationMatrix(object.matrix);
}
*/