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
	'flag' : 'idle',
	//current focused cube
	'slot' : null,
	//coordinates where the detection started
	'startPoint' : null,
	//the frames we want to spend on detecting direction
	'maxDetectingFrame' : 5,
	//the couter of frames during detection
	'frameCounter' : 0,
	//essential information for rotation
	'rotatingEssentials' : null,

	'initialize' : function(){
		var _ = this;

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
						_.directionCalc(_.mouse.clone());
					}
					break;
				case 'rotating':
					_.rotatingHandler();
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
					_.pushClickedCube();
			}
		}, false);

		//mouseup event
		document.addEventListener( 'mouseup', function(event){
			if(event.which === 1){
				//only react to the left button
				switch(_.flag){
					case 'detecting':
						//abort, when the flag is detecting
						_.abortDetection();
						break;
					case 'rotating':
						//check if it is a real rotation
						//_.checkRealRotation();
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
	},

	'pushClickedCube' : function(){
		var _ = this,
			rc = _.raycaster,
			mouse = _.mouse,
			scene = _.scene,
			obj;

		var intersects = rc.intersectObjects(scene.children);
		//mouse on the cube
		if(intersects.length > 0){
		//if the cursor is on a cube, then start the interaction
			_.slot = intersects[0].object;
			_.startPoint = _.mouse.clone();
			_.frameCounter++;
			//change the flag to detecting
			_.flag = 'detecting';
			console.log('Clicked on one cube. Flag: ' + _.flag + '; Slot: ' + _.slot);
		}
	},

	'abortDetection' : function(){
		var _ = this;

		//reset the flag, start point and frame counter
		_.flag = 'idle';
		_.startPoint = null;
		_.frameCounter = 0;
		//clear the slot
		_.slot = null;
		console.log('Interaction aborted during detection. Flag: ' + _.flag + '; Slot: ' + _.slot);
	},

	'checkRealRotation' : function(){
		console.log('checking if it is a valid rotation');
		var _ = this;

		//reset the flag to idle
	},

	'directionCalc' : function(coo){
		var _ = this;

		//reset the counter anyway
		_.frameCounter = 0;
		if(!coo.equals(_.startPoint)){
			//V2 - V1, calculate the angle between (0, 1)
			var direction = coo.sub(_.startPoint).normalize();
			var angle = - (Math.atan2(direction.y - 1, direction.x) * 360 / Math.PI);
			var rs = { 'axis' : null, 'clockwise' : null };
			if(0 < angle && angle < 60){
				rs.axis = 'x';
				rs.clockwise = true;
				console.log('user wants to rotate along with x axis, clockwise');
			}else if(angle < 120){
				rs.axis = 'y';
				rs.clockwise = false;
				console.log('user wants to rotate along with y axis, counter-clockwise');
			}else if(angle < 180){
				rs.axis = 'x';
				rs.clockwise = false;
				console.log('user wants to rotate along with x axis, counter-clockwise');
			}else if(angle < 240){
				rs.axis = 'z';
				rs.clockwise = true;
				console.log('user wants to rotate along with z axis, clockwise');
			}else if(angle < 300){
				rs.axis = 'y';
				rs.clockwise = true;
				console.log('user wants to rotate along with y axis, clockwise');
			}else{
				rs.axis = 'z';
				rs.clockwise = false;
				console.log('user wants to rotate along with z axis, counter-clockwise');
			}
			//push the result into the parent object
			_.rotatingEssentials = rs;
			//change flag from detecting to rotating
			_.flag = 'rotating';
		}
	},

	'rotatingHandler' : function(){
		var _ = this;
		console.log('rotating according to the cursor coordinates...');
		console.log(_.rotatingEssentials);
	},

	'test' : function(){
		var _ = this;

		var rotWorldMatrix;
		// Rotate an object around an arbitrary axis in world space       
		function rotateAroundWorldAxis(object, axis, radians) {
		    rotWorldMatrix = new THREE.Matrix4();
		    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

		    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

		    object.matrix = rotWorldMatrix;

		    object.rotation.setFromRotationMatrix(object.matrix);
		}

		//rotateAroundWorldAxis(_.slot, new THREE.Vector3(, , 0), - Math.PI / 4);
		console.log(_.slot.position);
	}
}
