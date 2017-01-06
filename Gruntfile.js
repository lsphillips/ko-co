'use strict';

// --------------------------------------------------------

module.exports = function (grunt)
{
	// Dependencies
	// -------------------------------------------------------

	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-mocha-cli');

	// Configuration
	// -------------------------------------------------------

	grunt.initConfig(
	{
		eslint :
		{
			options :
			{
				useEslintrc : true
			},

			src : ['src/KoCo.js', 'tests/KoCo.js']
		},

		// ------------------------------------------------------

		mochacli :
		{
			options :
			{
				reporter : 'spec'
			},

			src : ['tests/KoCo.js']
		}
	});

	// Task: `test`
	// -------------------------------------------------------

	grunt.registerTask('test', ['eslint', 'mochacli']);

	// Task `default`
	// -------------------------------------------------------

	grunt.registerTask('default', ['test']);
};
