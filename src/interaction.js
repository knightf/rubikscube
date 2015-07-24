/**
*
* Rubik's Cube
* Small web game done with three.js
*  - Interaction -
*
**/

Rubik.interaction = {
	//the beam
	'raycaster' : new THREE.Raycaster(),
	//the vector that stores cursor's coordinate
	'mouse' : new THREE.Vector2(),
	//current hovering cube
	'slot' : null,

	'initialize' : function(){
		var _ = this,
			mouse = _.mouse;

		//sync mouse vector with the cursor
		document.addEventListener( 'mousemove', function(){
			event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}, false );

		//mousedown event
		document.addEventListener( 'mousedown', function(){
			console.log(mouse);
		}, false);

		//mouseup event
		document.addEventListener( 'mouseup', function(){
			console.log(mouse);
		}, false);
	},

	'tick' : function(camera, scene){
		//console.log(this);
		var _ = this,
			rc = _.raycaster,
			mouse = _.mouse,
			obj;

		//set the ray along with mouse
		rc.setFromCamera( mouse, camera );

		var intersects = rc.intersectObjects(scene.children);
		//mouse on the cube
		if ( intersects.length > 0 ) {
			obj = intersects[0].object;
			if(_.slot === null){
				_.slot = obj;
			}else if(_.slot.uuid !== obj.uuid){
				_.slot = obj;
			}
		} else {
			_.slot = null;
		}
	},
}
