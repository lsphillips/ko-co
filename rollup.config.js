'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const commonjs   = require('rollup-plugin-commonjs');
const buble      = require('rollup-plugin-buble');
const { uglify } = require('rollup-plugin-uglify');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function build ()
{
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
