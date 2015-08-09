
module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

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

		less: {
			development: {
				options: {
					compress: false,
					optimization: 2,
				},
				files: {
					'./dest/images/main.css': './src/main.less'
				}
			}
		},

		watch:{
			less: {
				files: './src/main.less',
				tasks: ['less'],
			},
			
			uglify:{
				files: './src/*.js',
				tasks: ['uglify'],
			},

			liveload: {
				options: {
					livereload: true,
				},
				files: [
					'./dest/images/main.css',
					'./dest/rubik.lib.js',
					'./dest/index.html',
				],
			}
		}
	});

	grunt.registerTask('default', ['less', 'uglify', 'watch']);
}
