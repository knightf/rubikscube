/**
*
* Rubik's Cube
* Small web game done with three.js
*  - Mesh -
*
**/

Rubik.mesh = {
	'getCubes' : function(){
		var cubeSetting = Rubik.settings.cube;
		var cubeSide = cubeSetting.sideLength - cubeSetting.gap;

		var geometry = new THREE.BoxGeometry( cubeSide, cubeSide, cubeSide );

		var meterial = [];
		var facet = cubeSetting.facet;
		for(var i = 0; i < facet.length; i++){
			meterial.push( new THREE.MeshPhongMaterial({ color: facet[i] }) );
		}

		var cubes = [],
			stage = cubeSetting.stage,
			k, i, j, id;
		for(k = 0; k < stage; k++){
			for(i = 0; i < stage; i++){
				for(j = 0; j < stage; j++){
					id = k * stage * stage + i * stage + j;
					cubes[id] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(meterial));
					cubes[id].position.set(j + cubeSide / 2, i + cubeSide / 2, k + cubeSide / 2);
				}
			}
		}
		return cubes;
	},
}
