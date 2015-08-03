/**
*
* Rubik's Cube
* Small web game done with three.js
*  - DOM Events -
*
**/

Rubik.domEvents = {
	'onMouseMove' : function(_){
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
	},

	'onMouseUp' : function(_){
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
}