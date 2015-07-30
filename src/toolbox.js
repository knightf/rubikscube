/**
*
* Rubik's Cube
* Small web game done with three.js
*  - Tool Box -
*
**/

Rubik.toolbox = {
	//function that random the rubik's cube
	'random' : function(){
		//call the random level for certain times
		
		//done, update the state

		//initialize the interaction flag
		Rubik.interaction.flag = 'idle';
		console.log('%cstart to listen for user\'s interactions', 'color: red');
	},

	//function that rotates the whole cube
	'whole' : function(axis){

	},

	//function that randomly rotates one level
	'randomLevel' : function(){
		//check if it is random rotating now
		//false, generate an axis and a level
			//do a step
		//true, just do a step
	}
}
