'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const commonjs   = require('rollup-plugin-commonjs');
const buble      = require('rollup-plugin-buble');
const node       = require('rollup-plugin-node-resolve');
const { uglify } = require('rollup-plugin-uglify');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function build ({
	forTest = false
})
{
	if (forTest)
	{
		return {

			plugins :
			[
				commonjs(),
				node(),
				buble({
					transforms : {
						asyncAwait : false
					}
				})
			],

			output :
			{
				format : 'iife',
				name : 'tests',
				sourcemap : 'inline'
			}
		};
	}

	return {

		plugins :
		[
			commonjs(),
			buble(),
			uglify()
		],

		output :
		{
			file : 'KoCo.js',
			format : 'umd',
			name : 'KoCo',
			exports : 'named'
		},

		input : 'src/KoCo.js'
	};
};
