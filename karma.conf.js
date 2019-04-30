'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const build = require('./rollup.config');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function test (config)
{
	config.set(
	{
		files :
		[
			'tests/KoCo.test.js'
		],

		frameworks :
		[
			'mocha'
		],

		browsers :
		[
			'ChromeHeadless',
			'FirefoxHeadless'
		],

		preprocessors :
		{
			'tests/KoCo.test.js' : ['rollup']
		},

		client :
		{
			mocha : { timeout : 5000 }
		},

		rollupPreprocessor : build({
			forTest : true
		})
	});
};
