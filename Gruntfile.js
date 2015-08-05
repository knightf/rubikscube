
module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		wiredep: {
			target: {
				src: ['./src/index.html'],
			}
		},

		uglify: {
			options: {
    			mangle: true,
    		},
			my_target: {
				files: {
					'dest/rubik.lib.js' : [ "src/main.js", "src/mesh.js", "src/interaction.js", "src/interface.js", "src/domevents.js" ],
				}
			}
		},
	});

	grunt.registerTask('default');
}
