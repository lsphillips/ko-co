'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const commonjs        = require('@rollup/plugin-commonjs');
const { babel }       = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser }      = require('rollup-plugin-terser');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function build ()
{
	const plugins = () => [
		babel({
			babelHelpers : 'bundled'
		}),
		terser()
	];

	return [
		{
			input : 'src/ko-co.js',

			output :
			{
				file : 'ko-co.js',
				format : 'esm'
			},

			plugins : plugins()
		},
		{
			input : 'src/ko-co.js',

			output :
			{
				file : 'ko-co.cjs',
				format : 'umd',
				name : 'koco',
				exports : 'named'
			},

			plugins : plugins()
		}
	];
};

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
		},

		onwarn (warning, next)
		{
			if (warning.code !== 'CIRCULAR_DEPENDENCY' && warning.code !== 'EVAL')
			{
				next(warning);
			}
		}
	};
};
