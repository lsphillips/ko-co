import { babel } from '@rollup/plugin-babel';
import terser    from '@rollup/plugin-terser';

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

export default
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
