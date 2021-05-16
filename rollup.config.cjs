'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const commonjs        = require('@rollup/plugin-commonjs');
const { babel }       = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser }      = require('rollup-plugin-terser');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function bundle (output)
{
	return {

		input : 'src/ko-co.js',

		plugins :
		[
			babel({
				babelHelpers : 'bundled'
			}),
			terser()
		],

		output
	};
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports =
[
	bundle({
		file : 'ko-co.js',
		format : 'esm'
	}),

	bundle({
		file : 'ko-co.cjs',
		format : 'umd',
		name : 'koco',
		exports : 'named'
	})
];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports.buildForTests = function buildForTests ()
{
	return {

		plugins :
		[
			commonjs(),
			nodeResolve()
		],

		output :
		{
			format : 'iife',
			name : 'tests',
			sourcemap : 'inline'
		}
	};
};
