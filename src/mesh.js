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

		var repo = [],
			facet = cubeSetting.facet;

		for(var i = 0; i < facet.length; i++){
			repo.push( new THREE.MeshLambertMaterial({
       			ambient: 0xffffff,
        		map: facet[i],
        	}) );
		}
		repo.push( new THREE.MeshLambertMaterial({ color: 0xffffff }) );

		var meterial = [
			[ repo[5], repo[1], repo[5], repo[3], repo[5], repo[5] ],
			[ repo[5], repo[5], repo[5], repo[3], repo[5], repo[5] ],
			[ repo[0], repo[5], repo[5], repo[3], repo[5], repo[5] ],

			[ repo[5], repo[1], repo[5], repo[5], repo[5], repo[5] ],
			[ repo[5], repo[5], repo[5], repo[5], repo[5], repo[5] ],
			[ repo[0], repo[5], repo[5], repo[5], repo[5], repo[5] ],

			[ repo[5], repo[1], repo[2], repo[5], repo[5], repo[5] ],
			[ repo[5], repo[5], repo[2], repo[5], repo[5], repo[5] ],
			[ repo[0], repo[5], repo[2], repo[5], repo[5], repo[5] ],

			[ repo[5], repo[1], repo[5], repo[3], repo[5], repo[5] ],
			[ repo[5], repo[5], repo[5], repo[3], repo[5], repo[5] ],
			[ repo[0], repo[5], repo[5], repo[3], repo[5], repo[5] ],

			[ repo[5], repo[1], repo[5], repo[5], repo[5], repo[5] ],
			[ repo[5], repo[5], repo[5], repo[5], repo[5], repo[5] ],
			[ repo[0], repo[5], repo[5], repo[5], repo[5], repo[5] ],

			[ repo[5], repo[1], repo[2], repo[5], repo[5], repo[5] ],
			[ repo[5], repo[5], repo[2], repo[5], repo[5], repo[5] ],
			[ repo[0], repo[5], repo[2], repo[5], repo[5], repo[5] ],

			[ repo[5], repo[1], repo[5], repo[3], repo[4], repo[5] ],
			[ repo[5], repo[5], repo[5], repo[3], repo[4], repo[5] ],
			[ repo[0], repo[5], repo[5], repo[3], repo[4], repo[5] ],

			[ repo[5], repo[1], repo[5], repo[5], repo[4], repo[5] ],
			[ repo[5], repo[5], repo[5], repo[5], repo[4], repo[5] ],
			[ repo[0], repo[5], repo[5], repo[5], repo[4], repo[5] ],

			[ repo[5], repo[1], repo[2], repo[5], repo[4], repo[5] ],
			[ repo[5], repo[5], repo[2], repo[5], repo[4], repo[5] ],
			[ repo[0], repo[5], repo[2], repo[5], repo[4], repo[5] ],
		];

		var cubes = [],
			stage = cubeSetting.stage,
			k, i, j, id;
		for(k = 0; k < stage; k++){
			for(i = 0; i < stage; i++){
				for(j = 0; j < stage; j++){
					id = k * stage * stage + i * stage + j;
					cubes[id] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(meterial[ id ]));
					cubes[id].position.set(j * cubeSetting.sideLength + cubeSide / 2, i * cubeSetting.sideLength + cubeSide / 2, k * cubeSetting.sideLength + cubeSide / 2);
					cubes[id].name = 'cube';
				}
			}
		}
		return cubes;
	},
}
